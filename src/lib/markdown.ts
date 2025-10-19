import { remark } from "remark";
import html from "remark-html";
import matter from "gray-matter";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export async function parseMarkdown(markdown: string) {
  // Parse frontmatter and content
  const { data: frontmatter, content } = matter(markdown);

  // Extract headings for table of contents
  const headings: TocItem[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    // Trim whitespace and carriage returns
    const trimmedLine = line.trim();
    const match = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      headings.push({ id, text, level });
    }
  });

  // Convert markdown to HTML with IDs for headings
  const processedContent = await remark().use(html).process(content);
  let htmlContent = processedContent.toString();

  // Add IDs to heading tags
  headings.forEach((heading) => {
    const regex = new RegExp(
      `<h${heading.level}>\\s*${heading.text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )}\\s*</h${heading.level}>`,
      "i"
    );
    htmlContent = htmlContent.replace(
      regex,
      `<h${heading.level} id="${heading.id}">${heading.text}</h${heading.level}>`
    );
  });

  return {
    frontmatter,
    htmlContent,
    headings,
  };
}
