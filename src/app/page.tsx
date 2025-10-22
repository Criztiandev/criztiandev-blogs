import { getContentByType } from "@/lib/content/get-content";
import HomePageClient from "@/components/blog/homepage-client";

export default async function Home() {
  // SSR: Fetch first page of blogs on the server
  const allPosts = await getContentByType("blog");
  const sortedPosts = allPosts.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const initialData = {
    items: sortedPosts.slice(0, 9),
    nextCursor: sortedPosts.length > 9 ? 9 : undefined,
  };

  return <HomePageClient initialData={initialData} />;
}
