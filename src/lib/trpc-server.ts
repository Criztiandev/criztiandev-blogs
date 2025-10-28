import { appRouter } from "@/server/root";

/**
 * Server-side tRPC caller for SSR
 * Use this in Server Components to call tRPC procedures
 */
export const createServerCaller = () => {
  return appRouter.createCaller({});
};
