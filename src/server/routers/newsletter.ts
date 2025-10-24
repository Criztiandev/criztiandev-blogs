import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Newsletter Router
 * Handles email subscription for newsletter
 */
export const newsletterRouter = router({
  /**
   * Subscribe to newsletter
   * Validates email and stores in database
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      // Normalize email (lowercase, trim)
      const normalizedEmail = email.toLowerCase().trim();

      try {
        // Check if email already exists
        const { data: existing } = await supabaseAdmin
          .from("newsletter_subscribers")
          .select("email, status")
          .eq("email", normalizedEmail)
          .single();

        if (existing) {
          // Email already subscribed
          if (existing.status === "active") {
            return {
              success: true,
              message: "You're already subscribed! 🎉",
              alreadySubscribed: true,
            };
          }

          // Reactivate if previously unsubscribed
          const { error: updateError } = await supabaseAdmin
            .from("newsletter_subscribers")
            .update({ status: "active", updated_at: new Date().toISOString() })
            .eq("email", normalizedEmail);

          if (updateError) {
            throw new Error(`Failed to reactivate subscription: ${updateError.message}`);
          }

          return {
            success: true,
            message: "Welcome back! You're subscribed again! 🎉",
            alreadySubscribed: false,
          };
        }

        // Insert new subscriber
        const { error: insertError } = await supabaseAdmin.from("newsletter_subscribers").insert({
          email: normalizedEmail,
          status: "active",
          subscribed_at: new Date().toISOString(),
        });

        if (insertError) {
          // Handle unique constraint violation
          if (insertError.code === "23505") {
            return {
              success: true,
              message: "You're already subscribed! 🎉",
              alreadySubscribed: true,
            };
          }

          throw new Error(`Failed to subscribe: ${insertError.message}`);
        }

        return {
          success: true,
          message: "Thank you for subscribing! 🎉",
          alreadySubscribed: false,
        };
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to subscribe. Please try again."
        );
      }
    }),

  /**
   * Get subscriber count (for admin/stats)
   * Only counts active subscribers
   */
  getCount: publicProcedure.query(async () => {
    try {
      const { count, error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (error) {
        throw new Error(`Failed to get subscriber count: ${error.message}`);
      }

      return { count: count ?? 0 };
    } catch (error) {
      console.error("Get subscriber count error:", error);
      return { count: 0 };
    }
  }),
});
