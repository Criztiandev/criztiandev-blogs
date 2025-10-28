import { ProjectDetailClient } from "@/components/modules/client/project-detail-client";
import { createServerCaller } from "@/lib/trpc-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const caller = createServerCaller();
    const data = await caller.content.getBySlug({ type: "project", slug: decodedSlug });

    return {
      title: `${data.frontmatter.title} | Criztiandev`,
      description: (data.frontmatter.description as string) || "Project details",
    };
  } catch {
    return {
      title: "Project Not Found | Criztiandev",
      description: "Project not found",
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    // Fetch data server-side using tRPC caller
    const caller = createServerCaller();
    const data = await caller.content.getBySlug({ type: "project", slug: decodedSlug });

    // Pass data directly to client component
    return <ProjectDetailClient slug={decodedSlug} initialData={data} />;
  } catch {
    notFound();
  }
}
