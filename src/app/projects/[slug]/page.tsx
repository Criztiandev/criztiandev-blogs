import { getContentBySlug } from "@/lib/content/get-content";
import { ProjectDetailClient } from "@/components/blog/project-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await getContentBySlug("project", decodedSlug);
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
      title: "Project | Criztiandev",
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const data = await getContentBySlug("project", decodedSlug);

    const initialData = {
      slug: decodedSlug,
      frontmatter: data.frontmatter,
      markdownContent: data.markdownContent,
      headings: data.headings,
      rawContent: data.rawContent,
    };

    return <ProjectDetailClient slug={decodedSlug} initialData={initialData} />;
  } catch (error) {
    console.error("Error reading project:", error);
    notFound();
  }
}
