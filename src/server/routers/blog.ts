import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getAllBlogPosts, getBlogBySlug } from '@/lib/blog/get-blog-content';

export const blogRouter = router({
  /**
   * Get paginated list of blogs
   * Used for infinite scroll in grid layout
   */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(9),
        cursor: z.number().nullish(), // Cursor is the index of the last item
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      // Get all blog posts
      const allPosts = await getAllBlogPosts();

      // Sort by date (newest first)
      const sortedPosts = allPosts.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Calculate start index based on cursor
      const start = cursor ?? 0;
      const end = start + limit;

      // Get paginated items
      const items = sortedPosts.slice(start, end);

      // Determine next cursor
      const nextCursor = end < sortedPosts.length ? end : undefined;

      return {
        items,
        nextCursor,
      };
    }),

  /**
   * Get single blog post by slug
   * Returns the full blog post with parsed markdown content
   * Uses cached getBlogBySlug function
   */
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { slug } = input;

      try {
        const parsed = await getBlogBySlug(slug);

        return {
          slug,
          frontmatter: parsed.frontmatter,
          markdownContent: parsed.markdownContent,
          headings: parsed.headings,
          rawContent: parsed.rawContent,
        };
      } catch {
        throw new Error(`Blog post not found: ${slug}`);
      }
    }),
});
