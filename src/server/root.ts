import { router } from "./trpc";
import { contentRouter, blogRouter } from "./routers/content";
import { aiRouter } from "./routers/ai";

/**
 * Main tRPC router
 * Combines all sub-routers
 */
export const appRouter = router({
  content: contentRouter,
  blog: blogRouter, // Backward compatibility alias
  ai: aiRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
