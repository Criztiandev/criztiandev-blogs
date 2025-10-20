"use client";

import DraggableLayout from "@/components/modules/right-panel/draggable-layout";
import SearchModal from "@/components/modules/modals/search-modal";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Badge } from "@/components/ui/badge";
import { FloatingDock } from "@/components/ui/floating-dock";
import { GridLayout } from "@/components/ui/grid-layout";
import NAVIGATION_LINKS from "@/features/landing/data/navigation.data";
import { SKILL_SET } from "@/features/landing/data/skillset.data";
import SOCIALS_DATA from "@/features/landing/data/socials.data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import type { BlogPost } from "@/lib/blog/get-blog-content";
import NewsLetterModal from "../modules/modals/news-letter-modal";

interface HomePageClientProps {
  initialData: {
    items: BlogPost[];
    nextCursor?: number;
  };
}

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const [layoutMode, setLayoutMode] = useState<"free-space" | "grid">("free-space");
  const [contentFilter, setContentFilter] = useState<"blogs" | "projects" | "tools">("blogs");
  const [isSearchbarModalOpen, setIsSearchbarModalOpen] = useState(false);

  // tRPC infinite query with SSR initialData
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    trpc.blog.list.useInfiniteQuery(
      { limit: 9 },
      {
        initialData: {
          pages: [initialData],
          pageParams: [0],
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  // Intersection observer ref for infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);

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

  // Transform blog posts for display
  const blogPosts =
    data?.pages.flatMap((page, pageIndex) =>
      page.items.map((post, index) => ({
        id: post.id,
        title: post.title,
        src: post.image,
        className: `absolute ${getRandomPosition(pageIndex * 9 + index)}`,
        slug: post.slug,
        description: post.description,
        tags: post.tags,
        date: post.date,
      }))
    ) || [];

  const handleLayoutToggle = useCallback(() => {
    setLayoutMode((prev) => (prev === "free-space" ? "grid" : "free-space"));
  }, []);

  const handleContentFilter = useCallback((filter: "blogs" | "projects" | "tools") => {
    setContentFilter(filter);
  }, []);

  const handleSearch = useCallback(() => {
    setIsSearchbarModalOpen((prev) => !prev);
  }, []);

  // Generate random positions for cards
  function getRandomPosition(index: number) {
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
  }

  // Generate dock links based on current state
  const dockLinks = NAVIGATION_LINKS({
    onLayoutToggle: handleLayoutToggle,
    onContentFilter: handleContentFilter,
    onSearch: handleSearch,
    layoutMode,
    contentFilter,
  });

  return (
    <>
      <main className="h-screen">
        <div className="grid h-full grid-cols-[20%_auto]">
          <div className="flex flex-col items-center justify-between p-8">
            <header className="mt-12 flex flex-col gap-12">
              <div className="flex items-center justify-between">
                <span className="font-permanent-marker text-4xl font-bold">Criz</span>
                <AnimatedThemeToggler defaultValue="" />
              </div>

              <p className="text-muted-foreground">
                Hi, Im Criztian a Full Stack Developer focused on building scalable web and mobile
                apps with MERN, React Native, Laravel, and Generative AI. I collaborate with diverse
                teams to create impactful products that solve real problems with excellent user
                experiences.
              </p>

              <div className="flex flex-wrap gap-2">
                {SKILL_SET.map((items) => (
                  <Badge
                    key={items}
                    variant="outline"
                    className="text-md text-muted-foreground rounded-full px-4 py-2"
                  >
                    {items}
                  </Badge>
                ))}
              </div>

              <NewsLetterModal />
            </header>

            <footer className="flex w-full items-center justify-between">
              <span className="text-muted-foreground">@criztiandev</span>

              <div className="flex gap-2">
                {SOCIALS_DATA.map((social) => (
                  <Link key={social.id} href={social.href}>
                    {social.icon}
                  </Link>
                ))}
              </div>
            </footer>
          </div>

          <div className="relative">
            <div
              className={cn(
                "h-screen w-full border",
                "[background-size:40px_40px]",
                "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
              )}
            >
              <div
                className={cn("h-full w-full", layoutMode === "free-space" ? "block" : "hidden")}
              >
                <DraggableLayout payload={blogPosts} />
              </div>
              <div
                className={cn(
                  "h-full w-full overflow-auto",
                  layoutMode === "grid" ? "block" : "hidden"
                )}
              >
                <GridLayout cards={blogPosts} />

                {/* Loading states */}
                {isLoading && (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground">Loading blogs...</div>
                  </div>
                )}

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
            </div>

            <div className="absolute right-0 bottom-0 left-0 flex items-center justify-center p-4">
              <FloatingDock selectedItem={contentFilter} items={dockLinks} />
            </div>
          </div>
        </div>
      </main>

      <SearchModal isOpen={isSearchbarModalOpen} setIsOpen={setIsSearchbarModalOpen} />
    </>
  );
}
