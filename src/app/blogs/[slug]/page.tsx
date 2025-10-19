import { getBlogBySlug } from "@/lib/blog/get-blog-content";
import { BlogDetailClient } from "@/components/blog/blog-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await getBlogBySlug(decodedSlug);
    const title = (data.frontmatter.title as string) || decodedSlug;
    const description = (data.frontmatter.description as string) || "";
    const image = (data.frontmatter.image as string) || "";
    const date = data.frontmatter.date as string;
    const author = (data.frontmatter.author as string) || "Criztiandev";

    return {
      title: `${title} | Criztiandev`,
      description,
      openGraph: {
        title,
        description,
        images: [image],
        type: "article",
        publishedTime: date,
        authors: [author],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Blog Post | Criztiandev",
    };
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await getBlogBySlug(decodedSlug);

    const initialData = {
      slug: decodedSlug,
      frontmatter: data.frontmatter,
      markdownContent: data.markdownContent,
      headings: data.headings,
      rawContent: data.rawContent,
    };

    return <BlogDetailClient slug={decodedSlug} initialData={initialData} />;
  } catch (error) {
    console.error("Error reading blog:", error);
    notFound();
  }
}
