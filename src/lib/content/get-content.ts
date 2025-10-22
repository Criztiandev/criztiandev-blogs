import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { parseMarkdownWithCodeBlocks } from "../blog/markdown-parser";
import { parseMarkdown } from "../markdown";

export type ContentType = "blog" | "project" | "aboutme";

export interface ContentPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  type: ContentType;
  // Blog-specific fields (optional for aboutme/projects)
  date?: string;
  author?: string;
  tags?: string[];
  // Optional HTML content (added when fetched with getContentBySlugWithHTML)
  htmlContent?: string;
}

/**
 * Get directory path for content type
 */
function getContentDir(type: ContentType): string {
  const dirMap: Record<ContentType, string> = {
    blog: "blogs",
    project: "projects",
    aboutme: "aboutme",
  };
  return path.join(process.cwd(), "content", dirMap[type]);
}

/**
 * Get single content item by slug with complete parsing
 * Cached to prevent duplicate reads within a single request
 */
export const getContentBySlug = cache(async (type: ContentType, slug: string) => {
  const contentDir = getContentDir(type);
  const markdownPath = path.join(contentDir, `${slug}.md`);

  const fileContent = await fs.readFile(markdownPath, "utf-8");
  const parsed = await parseMarkdownWithCodeBlocks(fileContent);

  return parsed;
});

/**
 * Get single content item with HTML rendering (for aboutme/projects)
 * Cached to prevent duplicate reads within a single request
 */
export const getContentBySlugWithHTML = cache(async (type: ContentType, slug: string) => {
  const contentDir = getContentDir(type);
  const markdownPath = path.join(contentDir, `${slug}.md`);

  const fileContent = await fs.readFile(markdownPath, "utf-8");
  const parsed = await parseMarkdown(fileContent);

  return parsed;
});

/**
 * Get all content items by type with metadata
 * Cached to prevent duplicate filesystem reads
 */
export const getContentByType = cache(async (type: ContentType): Promise<ContentPost[]> => {
  const contentDir = getContentDir(type);

  try {
    // Read all files in the content directory
    const files = await fs.readdir(contentDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // Parse each markdown file
    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(contentDir, filename);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);

        // Generate slug from filename (remove .md extension)
        const slug = filename.replace(/\.md$/, "");

        const post: ContentPost = {
          id: slug,
          slug,
          title: (data.title as string) || slug,
          description: (data.description as string) || "",
          image: (data.image as string) || "",
          type,
        };

        // Add date, author, and tags for blogs and projects
        if (type === "blog" || type === "project") {
          post.date = (data.date as string) || "";
          post.author = (data.author as string) || "Criztiandev";
          post.tags = (data.tags as string[]) || [];
        }

        // Parse HTML content for aboutme and project types
        if (type === "aboutme" || type === "project") {
          const parsed = await parseMarkdown(fileContent);
          post.htmlContent = parsed.htmlContent;
        }

        return post;
      })
    );

    return posts;
  } catch (error) {
    console.error(`Error reading ${type} posts:`, error);
    return [];
  }
});

/**
 * Backward compatibility: Get all blog posts
 */
export const getAllBlogPosts = () => getContentByType("blog");

/**
 * Backward compatibility: Get blog by slug
 */
export const getBlogBySlug = (slug: string) => getContentBySlug("blog", slug);
