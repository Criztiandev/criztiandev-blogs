"use client";

import { GridLayout } from "@/components/ui/grid-layout";
import DraggableLayout from "@/components/layout/draggable-layout";
import { trpc } from "@/lib/trpc";
import type { ContentType, ContentPost } from "@/lib/content/get-content";
import { useLayoutContext } from "@/contexts/layout-context";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ContentGridProps {
  type: ContentType;
  initialData?: {
    items: ContentPost[];
    nextCursor?: number;
  };
  GridCardComponent?: React.ComponentType<{
    id: string;
    slug: string;
    title: string;
    description?: string;
    image: string;
    tags?: string[];
    date?: string;
    index: number;
    type: ContentType;
    isSkeleton?: boolean;
  }>;
  DraggableCardComponent?: React.ComponentType<{
    data: {
      id: string;
      title: string;
      src: string;
      className: string;
      slug?: string;
      description?: string;
      tags?: string[];
      date?: string;
      type?: ContentType;
      responsibilities?: string[];
      htmlContent?: string;
    };
    onClick: () => void;
    variant?: string;
  }>;
}

export function ContentGrid({
  type,
  initialData,
  GridCardComponent,
  DraggableCardComponent,
}: ContentGridProps) {
  const { layoutMode } = useLayoutContext();
  const observerRef = useRef<HTMLDivElement>(null);

  // tRPC infinite query
  const queryOptions = initialData
    ? {
        initialData: {
          pages: [initialData],
          pageParams: [0],
        },
        getNextPageParam: (lastPage: { nextCursor?: number }) => lastPage.nextCursor,
      }
    : {
        getNextPageParam: (lastPage: { nextCursor?: number }) => lastPage.nextCursor,
      };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    type === "blog" && initialData
      ? trpc.blog.list.useInfiniteQuery({ limit: 9 }, queryOptions)
      : trpc.content.list.useInfiniteQuery({ type, limit: 9 }, queryOptions);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!observerRef.current || layoutMode !== "grid") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, layoutMode]);

  // Generate random positions for draggable cards
  const getRandomPosition = useCallback((index: number) => {
    const positions = [
      "top-40 left-[20%] rotate-[-5deg]",
      "top-80 left-[25%] rotate-[-7deg]",
      "top-25 left-[40%] rotate-[8deg]",
      "top-64 left-[55%] rotate-[10deg]",
      "top-40 right-[35%] rotate-[2deg]",
      "top-84 left-[45%] rotate-[-7deg]",
      "top-28 left-[30%] rotate-[4deg]",
    ];
    return positions[index % positions.length];
  }, []);

  // Transform content for display
  const contentPosts = isLoading
    ? // Show skeleton cards while loading
      Array.from({ length: 9 }, (_, i) => ({
        id: `skeleton-${i}`,
        title: `skeleton-title-${i}`,
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E",
        className: `absolute ${getRandomPosition(i)}`,
        slug: `skeleton-slug-${i}`,
        description: "",
        tags: [],
        date: "",
        type: type,
        responsibilities: [],
        htmlContent: "",
        isSkeleton: true,
      }))
    : data?.pages.flatMap((page, pageIndex) =>
        page.items.map((post: ContentPost, index: number) => ({
          id: post.id,
          title: post.title,
          src: post.image,
          className: `absolute ${getRandomPosition(pageIndex * 9 + index)}`,
          slug: post.slug,
          description: post.description,
          tags: post.tags || [],
          date: post.date || "",
          type: type,
          responsibilities: [],
          htmlContent: post.htmlContent || "",
          isSkeleton: false,
        }))
      ) || [];

  return (
    <>
      {/* Free Space Layout - Desktop only (≥1024px) when layoutMode is "free-space" */}
      {layoutMode === "free-space" && (
        <div className="hidden h-full w-full lg:block">
          <DraggableLayout
            payload={contentPosts}
            type={type}
            CardComponent={DraggableCardComponent}
          />
        </div>
      )}

      {/* Grid Layout - Always show on mobile/tablet (<1024px), or when layoutMode is "grid" on desktop */}
      <div
        className={cn(
          "h-full w-full overflow-auto",
          layoutMode === "grid" ? "block" : "block lg:hidden"
        )}
      >
        <GridLayout cards={contentPosts} type={type} CardComponent={GridCardComponent} />

        {/* Intersection observer target for infinite scroll */}
        {layoutMode === "grid" && hasNextPage && (
          <div ref={observerRef} className="flex items-center justify-center p-8">
            {isFetchingNextPage ? (
              <div className="text-muted-foreground">Loading more...</div>
            ) : (
              <div className="h-20" />
            )}
          </div>
        )}
      </div>

      {/* Loading states */}
      {isLoading && layoutMode === "grid" && (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}
    </>
  );
}
