import { getContentByType, getContentBySlugWithHTML } from "@/lib/content/get-content";
import AboutPageClient from "@/components/blog/about-page-client";
import { AboutMeCardDraggable } from "@/components/blog/about-me-card-draggable";

export default async function AboutPage() {
  // SSR: Fetch first page of aboutme on the server
  const allPosts = await getContentByType("aboutme");

  // Fetch HTML content for each aboutme card
  const postsWithHTML = await Promise.all(
    allPosts.slice(0, 9).map(async (post) => {
      try {
        const fullPost = await getContentBySlugWithHTML("aboutme", post.slug);
        return {
          ...post,
          htmlContent: fullPost.htmlContent,
        };
      } catch (error) {
        console.error(`Error loading content for ${post.slug}:`, error);
        return post;
      }
    })
  );

  const initialData = {
    items: postsWithHTML,
    nextCursor: allPosts.length > 9 ? 9 : undefined,
  };

  return (
    <AboutPageClient initialData={initialData} DraggableCardComponent={AboutMeCardDraggable} />
  );
}
