import matter from "gray-matter";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>;
  markdownContent: string;
  headings: TocItem[];
  rawContent: string;
}

/**
 * Parse markdown content and extract metadata
 * Returns raw markdown for react-markdown to render
 */
export async function parseMarkdownWithCodeBlocks(
  markdown: string
): Promise<ParsedMarkdown> {
  // Parse frontmatter and content
  const { data: frontmatter, content } = matter(markdown);

  // Extract headings for table of contents
  const headings = extractHeadings(content);

  return {
    frontmatter,
    markdownContent: content,
    headings,
    rawContent: content,
  };
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
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

  return headings;
}
