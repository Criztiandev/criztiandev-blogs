import { getAllBlogPosts } from "@/lib/blog/get-blog-content";
import HomePageClient from "@/components/blog/homepage-client";

export default async function Home() {
  // SSR: Fetch first page of blogs on the server
  const allPosts = await getAllBlogPosts();
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const initialData = {
    items: sortedPosts.slice(0, 9),
    nextCursor: sortedPosts.length > 9 ? 9 : undefined,
  };

  return <HomePageClient initialData={initialData} />;
}
