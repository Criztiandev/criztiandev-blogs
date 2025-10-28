"use client";

import { GridLayout } from "@/components/ui/grid-layout";
import DraggableLayout from "@/components/layout/draggable-layout";
import { trpc } from "@/lib/trpc";
import type { ContentType, ContentPost } from "@/lib/content/get-content";
import { useLayoutContext } from "@/contexts/layout-context";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { loaderData } from "@/data/loader.data";
import { getRandomPosition } from "@/utils/position.utils";
import {
  ContentInitialData,
  DraggableCardComponent,
  GridCardComponent,
} from "@/types/content.types";
export interface ContentGridProps {
  type: ContentType;
  initialData?: ContentInitialData;
  GridCardComponent?: React.ComponentType<GridCardComponent>;
  DraggableCardComponent?: React.ComponentType<DraggableCardComponent>;
}

export function ContentGrid({
  type,
  initialData,
  GridCardComponent,
  DraggableCardComponent,
}: ContentGridProps) {
  const { layoutMode } = useLayoutContext();
  const observerRef = useRef<HTMLDivElement>(null);

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

  const contentPosts = isLoading
    ? loaderData(type)
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
          type: type as ContentType,
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
            payload={
              contentPosts as Array<{
                id: string;
                title: string;
                src: string;
                className: string;
                slug?: string;
                type?: ContentType;
              }>
            }
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
