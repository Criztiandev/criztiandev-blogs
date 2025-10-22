import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getContentByType, getContentBySlug, type ContentType } from "@/lib/content/get-content";

const contentTypeSchema = z.enum(["blog", "project", "aboutme"]);

export const contentRouter = router({
  list: publicProcedure
    .input(
      z.object({
        type: contentTypeSchema.default("blog"),
        limit: z.number().min(1).max(100).default(9),
        cursor: z.number().nullish(), // Cursor is the index of the last item
      })
    )
    .query(async ({ input }) => {
      const { type, limit, cursor } = input;

      const allPosts = await getContentByType(type as ContentType);

      const sortedPosts = allPosts.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      const start = cursor ?? 0;
      const end = start + limit;

      const items = sortedPosts.slice(start, end);
      const nextCursor = end < sortedPosts.length ? end : undefined;

      return {
        items,
        nextCursor,
      };
    }),

  getBySlug: publicProcedure
    .input(
      z.object({
        type: contentTypeSchema.default("blog"),
        slug: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { type, slug } = input;

      try {
        const parsed = await getContentBySlug(type as ContentType, slug);

        return {
          slug,
          type,
          frontmatter: parsed.frontmatter,
          markdownContent: parsed.markdownContent,
          headings: parsed.headings,
          rawContent: parsed.rawContent,
        };
      } catch {
        throw new Error(`${type} post not found: ${slug}`);
      }
    }),
});

export const blogRouter = contentRouter;
