import { getContentByType } from "@/lib/content/get-content";
import ContentPageClient from "@/components/blog/content-page-client";

export default async function ProjectsPage() {
  // SSR: Fetch first page of projects on the server
  const allPosts = await getContentByType("project");
  const sortedPosts = allPosts.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const initialData = {
    items: sortedPosts.slice(0, 9),
    nextCursor: sortedPosts.length > 9 ? 9 : undefined,
  };

  return <ContentPageClient type="project" initialData={initialData} />;
}
