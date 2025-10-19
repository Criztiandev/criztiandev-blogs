import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
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
}
