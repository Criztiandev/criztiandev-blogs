import { BlogDetailClientWrapper } from "@/components/blog/blog-detail-client-wrapper";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Basic metadata - will be enhanced client-side
  return {
    title: `${decodedSlug} | Criztiandev`,
    description: "Blog post",
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Just pass the slug - fetching happens client-side
  return <BlogDetailClientWrapper slug={decodedSlug} />;
}
