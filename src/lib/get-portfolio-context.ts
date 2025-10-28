import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllBlogPosts } from "./get-blog-posts";

/**
 * Builds AI context string for portfolio assistant
 * Following The Algorithm: Question → Delete → Simplify
 *
 * Target: ~8K tokens total context
 * - About Me: ~2K tokens (key career highlights only)
 * - Projects: ~2K tokens (summaries, no full content)
 * - Blogs: ~4K tokens (titles + descriptions only, NOT full content)
 */
export async function getPortfolioContext(): Promise<string> {
  try {
    // 1. Get About Me context (simplified - only key files)
    const aboutContext = await getAboutMeContext();

    // 2. Get Projects context (summaries only)
    const projectsContext = await getProjectsContext();

    // 3. Get Blogs context (frontmatter only, NOT full content)
    const blogsContext = await getBlogsContext();

    // Build final context string
    const context = `
# ABOUT CRIZTIAN TUPLANO

${aboutContext}

---

# PROJECTS (${projectsContext.count})

${projectsContext.content}

---

# BLOG POSTS (${blogsContext.count})

${blogsContext.content}

---

# ADDITIONAL INFO

- CV/Resume: Available at /content/aboutme/(10-17-2025)TUPLANO CRIZTIAN CV(2025) (1).pdf
- Portfolio Site: Built with Next.js 15, tRPC, TanStack Query, Tailwind CSS
- Tech Stack: React, TypeScript, Node.js, Next.js, tRPC, Groq AI, Framer Motion
- Location: Philippines

## Social Links
- LinkedIn: https://www.linkedin.com/in/criztian-jade-tuplano-036b85258/
- Medium: https://medium.com/@criztiandev
- X (Twitter): https://x.com/criztiandev
- Instagram: https://www.instagram.com/criztiandev/

---

# YOUR ROLE

You are Polar, Criztian Jade M. Tuplano's trusted companion and Portfolio Assistant. Your job:

1. Answer questions about HIS portfolio data ONLY (projects, blogs, skills, experience, socials)
2. Stay on topic - politely redirect off-topic questions
3. Be conversational, helpful, and concise

## Tech Stack Queries
When asked about projects with specific tech (e.g., "show me React projects"):
- Search the projects list above for matching technologies in the "Tech:" field
- List ALL matching projects with their titles and links
- If NO matches found: Say "I don't have [tech] projects, but here are some recent projects:" then show 5 projects from the list

## Identity
If asked "Who are you?" or about your identity:
- Say: "I'm Polar, Criztian's trusted companion and portfolio assistant. I'm here to help you learn about his work, projects, and expertise."

## Off-Topic Questions
If asked about unrelated topics (weather, news, general knowledge):
- Respond: "I'm here to help with Criztian's portfolio, projects, and blogs. I don't have information about [topic]."

## Blog Content Details
For detailed blog discussions, redirect to: /blogs/[slug] and use the AI chat there.

Be conversational, helpful, and concise.
`.trim();

    return context;
  } catch (error) {
    console.error("Error building portfolio context:", error);
    return "Error loading portfolio context. Please try again.";
  }
}

/**
 * Get About Me context - ONLY key career highlights
 * Following The Algorithm: Delete unnecessary files, keep only essentials
 */
async function getAboutMeContext(): Promise<string> {
  const aboutDir = path.join(process.cwd(), "content", "aboutme");

  // Key files only (The Algorithm: Delete unnecessary context)
  const keyFiles = ["fullstack-developer.md", "my-skills.md", "techstack.md"];

  const sections: string[] = [];

  for (const filename of keyFiles) {
    try {
      const filePath = path.join(aboutDir, filename);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      // Add title and content
      sections.push(`## ${data.title || filename.replace(".md", "")}\n${content.trim()}`);
    } catch (error) {
      // File not found or error reading - skip it
      console.warn(`Could not read ${filename}:`, error);
    }
  }

  return sections.join("\n\n");
}

/**
 * Get Projects context - summaries only (NOT full content)
 * Following The Algorithm: Simplify - send summaries, not full markdown
 */
async function getProjectsContext(): Promise<{ content: string; count: number }> {
  const projectsDir = path.join(process.cwd(), "content", "projects");

  try {
    const files = await fs.readdir(projectsDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const projects = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(projectsDir, filename);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);

        return {
          title: data.title || filename.replace(".md", ""),
          description: data.description || "",
          tags: (data.tags as string[]) || [],
          slug: data.slug || filename.replace(".md", ""),
        };
      })
    );

    // Format as concise list (The Algorithm: Simplify)
    const content = projects
      .map(
        (p) =>
          `- **${p.title}**: ${p.description}\n  Tech: ${p.tags.join(", ")}\n  Link: /projects/${p.slug}`
      )
      .join("\n\n");

    return { content, count: projects.length };
  } catch (error) {
    console.error("Error reading projects:", error);
    return { content: "Projects information unavailable", count: 0 };
  }
}

/**
 * Get Blogs context - frontmatter ONLY (NOT full blog content)
 * Following The Algorithm: Delete unnecessary data - summaries only
 */
async function getBlogsContext(): Promise<{ content: string; count: number }> {
  try {
    const blogs = await getAllBlogPosts();

    // Sort by date (newest first)
    const sortedBlogs = blogs.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Format as concise list (The Algorithm: Simplify - NOT full content)
    const content = sortedBlogs
      .map(
        (blog) =>
          `- **"${blog.title}"** (${blog.date})\n  ${blog.description}\n  Tags: ${blog.tags.join(", ")}\n  Link: /blogs/${blog.slug}`
      )
      .join("\n\n");

    return { content, count: blogs.length };
  } catch (error) {
    console.error("Error reading blogs:", error);
    return { content: "Blog information unavailable", count: 0 };
  }
}
