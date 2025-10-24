"use client";

import { trpc } from "@/lib/trpc";
import { BlogDetailClient } from "./blog-detail-client";
import { notFound } from "next/navigation";

interface BlogDetailClientWrapperProps {
  slug: string;
}

export function BlogDetailClientWrapper({ slug }: BlogDetailClientWrapperProps) {
  // Fetch blog data client-side using tRPC
  const { data, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug, type: "blog" },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Show loading state (Next.js loading.tsx will also show)
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        {/* Fixed header skeleton */}
        <header className="bg-background/80 fixed top-0 right-0 left-0 z-40 border-b backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="bg-muted h-5 w-32 animate-pulse rounded" />
          </div>
        </header>

        {/* Main content loading skeleton */}
        <main className="pt-20">
          <article>
            {/* Hero section skeleton */}
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-12 lg:px-8">
              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="bg-muted h-12 w-3/4 animate-pulse rounded" />
                <div className="bg-muted h-12 w-full animate-pulse rounded" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="bg-muted h-6 w-full animate-pulse rounded" />
                <div className="bg-muted h-6 w-5/6 animate-pulse rounded" />
              </div>

              {/* Metadata skeleton */}
              <div className="flex gap-4">
                <div className="bg-muted h-5 w-24 animate-pulse rounded" />
                <div className="bg-muted h-5 w-24 animate-pulse rounded" />
                <div className="bg-muted h-5 w-32 animate-pulse rounded" />
              </div>
            </div>

            {/* Image skeleton */}
            <div className="bg-muted relative mx-auto mb-8 aspect-video w-full max-w-7xl animate-pulse rounded-lg px-4 sm:mb-16 sm:px-6 lg:px-8" />

            {/* Content skeleton */}
            <div className="mx-auto max-w-3xl space-y-4 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-4/5 animate-pulse rounded" />

              <div className="py-4" />

              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
            </div>
          </article>
        </main>
      </div>
    );
  }

  // Handle error
  if (error || !data) {
    console.error("Error loading blog:", error);
    notFound();
  }

  // Render actual blog content
  return <BlogDetailClient slug={slug} initialData={data} />;
}
