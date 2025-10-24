import { router } from "./trpc";
import { contentRouter, blogRouter } from "./routers/content";
import { aiRouter } from "./routers/ai";
import { engagementRouter } from "./routers/engagement";
import { rateLimitRouter } from "./routers/rateLimit";
import { newsletterRouter } from "./routers/newsletter";

/**
 * Main tRPC router
 * Combines all sub-routers
 */
export const appRouter = router({
  content: contentRouter,
  blog: blogRouter, // Backward compatibility alias
  ai: aiRouter,
  engagement: engagementRouter,
  rateLimit: rateLimitRouter,
  newsletter: newsletterRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
