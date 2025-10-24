import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for blog detail page
 * Shows while content is being fetched
 */
export function BlogDetailSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      {/* Fixed header skeleton */}
      <header className="bg-background/80 fixed top-0 right-0 left-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-32" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="pt-20">
        <article>
          {/* Hero section skeleton */}
          <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-12 lg:px-8">
            {/* Title */}
            <div className="space-y-3">
              <Skeleton className="h-12 w-full sm:h-14" />
              <Skeleton className="h-12 w-3/4 sm:h-14" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Hero image skeleton */}
          <div className="relative mx-auto mb-8 aspect-video w-full max-w-7xl overflow-hidden rounded-lg px-4 sm:mb-16 sm:px-6 lg:px-8">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content skeleton */}
          <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <div className="py-4" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />

            <div className="py-4" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </article>
      </main>
    </div>
  );
}
