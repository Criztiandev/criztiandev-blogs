import { BlogDetailClient } from "@/components/modules/client/blog-detail-client";
import { createServerCaller } from "@/lib/trpc-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const caller = createServerCaller();
    const data = await caller.blog.getBySlug({ slug: decodedSlug });

    return {
      title: `${data.frontmatter.title} | Criztiandev`,
      description: (data.frontmatter.description as string) || "Blog post",
    };
  } catch {
    return {
      title: "Blog Not Found | Criztiandev",
      description: "Blog post not found",
    };
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    // Fetch data server-side using tRPC caller
    const caller = createServerCaller();
    const data = await caller.blog.getBySlug({ slug: decodedSlug });

    // Pass data directly to client component
    return <BlogDetailClient slug={decodedSlug} initialData={data} />;
  } catch {
    notFound();
  }
}
