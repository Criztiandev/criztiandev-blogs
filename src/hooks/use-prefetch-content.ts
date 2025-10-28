"use client";

import { trpc } from "@/lib/trpc";
import type { ContentType } from "@/lib/content/get-content";

/**
 * Hook to prefetch content details on hover for instant navigation
 */
export function usePrefetchContent() {
  const utils = trpc.useUtils();

  const prefetchBlog = (slug: string) => {
    // Prefetch blog detail data
    utils.blog.getBySlug.prefetch({ slug });
  };

  const prefetchContent = (type: ContentType, slug: string) => {
    // Prefetch content detail data
    utils.content.getBySlug.prefetch({ type, slug });
  };

  return { prefetchBlog, prefetchContent };
}
