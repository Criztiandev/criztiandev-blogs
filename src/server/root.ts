import { router } from "./trpc";
import { blogRouter } from "./routers/blog";
import { aiRouter } from "./routers/ai";

/**
 * Main tRPC router
 * Combines all sub-routers
 */
export const appRouter = router({
  blog: blogRouter,
  ai: aiRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
