import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { supabase } from "@/lib/supabase";

/**
 * Engagement Router
 * Handles blog likes and share tracking
 */
export const engagementRouter = router({
  /**
   * LIKES
   */
  like: router({
    /**
     * Get like count for a blog post
     */
    get: publicProcedure
      .input(
        z.object({
          slug: z.string().min(1),
        })
      )
      .query(async ({ input }) => {
        const { slug } = input;

        const { data, error } = await supabase
          .from("blog_likes")
          .select("count")
          .eq("blog_slug", slug)
          .single();

        if (error) {
          // If blog doesn't exist in DB yet, return 0
          if (error.code === "PGRST116") {
            return { count: 0 };
          }
          throw new Error(`Failed to get like count: ${error.message}`);
        }

        return { count: data?.count ?? 0 };
      }),

    /**
     * Toggle like for a blog post
     * Increments or decrements based on current user state
     */
    toggle: publicProcedure
      .input(
        z.object({
          slug: z.string().min(1),
          increment: z.number().int().min(-1).max(1), // -1 to unlike, +1 to like
        })
      )
      .mutation(async ({ input }) => {
        const { slug, increment } = input;

        // Use the atomic function we created in SQL
        const { data, error } = await supabase.rpc("increment_like_count", {
          p_blog_slug: slug,
          p_increment: increment,
        });

        if (error) {
          throw new Error(`Failed to toggle like: ${error.message}`);
        }

        return { count: data as number };
      }),
  }),

  /**
   * SHARES
   */
  shares: router({
    /**
     * Get share counts for a blog post
     * Returns counts for all platforms
     */
    get: publicProcedure
      .input(
        z.object({
          slug: z.string().min(1),
        })
      )
      .query(async ({ input }) => {
        const { slug } = input;

        const { data, error } = await supabase
          .from("blog_shares")
          .select("platform, count")
          .eq("blog_slug", slug);

        if (error) {
          throw new Error(`Failed to get share counts: ${error.message}`);
        }

        // Transform array to object for easier access
        const shares = {
          twitter: 0,
          linkedin: 0,
          facebook: 0,
          medium: 0,
        };

        data?.forEach((row) => {
          shares[row.platform as keyof typeof shares] = row.count;
        });

        return shares;
      }),

    /**
     * Get total share count for a blog post (sum of all platforms)
     */
    getTotal: publicProcedure
      .input(
        z.object({
          slug: z.string().min(1),
        })
      )
      .query(async ({ input }) => {
        const { slug } = input;

        const { data, error } = await supabase
          .from("blog_shares")
          .select("count")
          .eq("blog_slug", slug);

        if (error) {
          throw new Error(`Failed to get total share count: ${error.message}`);
        }

        // Sum all platform counts
        const total = data?.reduce((sum, row) => sum + row.count, 0) ?? 0;

        return { total };
      }),

    /**
     * Increment share count for a blog post on a specific platform
     * Fire-and-forget from client - don't block UI
     */
    increment: publicProcedure
      .input(
        z.object({
          slug: z.string().min(1),
          platform: z.enum(["twitter", "linkedin", "facebook", "medium"]),
        })
      )
      .mutation(async ({ input }) => {
        const { slug, platform } = input;

        // Use the atomic function we created in SQL
        const { data, error } = await supabase.rpc("increment_share_count", {
          p_blog_slug: slug,
          p_platform: platform,
        });

        if (error) {
          // Log error but don't throw - we don't want to break UI for analytics failure
          console.error(`Failed to increment share count:`, error);
          return { count: 0, success: false };
        }

        return { count: data as number, success: true };
      }),
  }),
});
