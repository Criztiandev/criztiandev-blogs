import { ProjectDetailClientWrapper } from "@/components/blog/project-detail-client-wrapper";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Basic metadata - will be enhanced client-side
  return {
    title: `${decodedSlug} | Criztiandev`,
    description: "Project showcase",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Just pass the slug - fetching happens client-side
  return <ProjectDetailClientWrapper slug={decodedSlug} />;
}
