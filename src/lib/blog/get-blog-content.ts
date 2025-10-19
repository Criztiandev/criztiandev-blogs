import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { parseMarkdownWithCodeBlocks } from "./markdown-parser";

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  image: string;
  slug: string;
  tags: string[];
  description: string;
}

/**
 * Get single blog post by slug with complete parsing
 * Cached to prevent duplicate reads within a single request
 */
export const getBlogBySlug = cache(async (slug: string) => {
  const markdownPath = path.join(
    process.cwd(),
    "content",
    "blogs",
    `${slug}.md`
  );

  const fileContent = await fs.readFile(markdownPath, "utf-8");
  const parsed = await parseMarkdownWithCodeBlocks(fileContent);

  return parsed;
});

/**
 * Get all blog posts with metadata
 * Cached to prevent duplicate filesystem reads
 */
export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const blogDir = path.join(process.cwd(), "content", "blogs");

  try {
    // Read all files in the blog directory
    const files = await fs.readdir(blogDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    // Parse each markdown file
    const posts = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(blogDir, filename);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);

        // Generate slug from filename (remove .md extension)
        const slug = filename.replace(/\.md$/, "");

        return {
          id: slug,
          slug,
          title: (data.title as string) || slug,
          date: (data.date as string) || "",
          author: (data.author as string) || "Criztiandev",
          image:
            (data.image as string) ||
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
          tags: (data.tags as string[]) || [],
          description: (data.description as string) || "",
        };
      })
    );

    return posts;
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
});
