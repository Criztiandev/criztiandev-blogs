"use client";

import { MainLayoutSidebar } from "@/components/layout/main-layout";
import SearchModal from "@/components/blocks/modals/search-modal";
import { FloatingDock } from "@/components/ui/floating-dock";
import NAVIGATION_LINKS from "@/features/landing/data/navigation.data";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutContext } from "@/contexts/layout-context";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<"free-space" | "grid">("free-space");
  const [isSearchbarModalOpen, setIsSearchbarModalOpen] = useState(false);
  const pathname = usePathname();

  const handleLayoutToggle = useCallback(() => {
    setLayoutMode((prev) => (prev === "free-space" ? "grid" : "free-space"));
  }, []);

  const handleSearch = useCallback(() => {
    setIsSearchbarModalOpen((prev) => !prev);
  }, []);

  // Generate dock links based on current state
  const dockLinks = NAVIGATION_LINKS({
    onLayoutToggle: handleLayoutToggle,
    onSearch: handleSearch,
    layoutMode,
  });

  // Determine current page type for search modal and floating dock
  const getCurrentType = () => {
    if (pathname === "/") return "blog";
    if (pathname.startsWith("/blogs")) return "blog";
    if (pathname.startsWith("/projects")) return "project";
    if (pathname.startsWith("/about")) return "aboutme";
    return "blog";
  };

  const currentType = getCurrentType();
  const selectedItem = pathname === "/" ? "blogs" : currentType;

  return (
    <LayoutContext.Provider value={{ layoutMode }}>
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-[350px_auto] xl:grid-cols-[400px_auto]">
        <MainLayoutSidebar />

        <div className="min-h-screen grid-cols-1">
          {/* Desktop Sidebar Spacer */}
          <div className="hidden lg:block" />

          <div className="relative">
            <div
              className={cn(
                "min-h-screen w-full border",
                "[background-size:40px_40px]",
                "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
              )}
            >
              {/* Content slot - pages render here */}
              {children}
            </div>

            <div className="absolute right-0 bottom-0 left-0 flex items-center justify-center p-4">
              <FloatingDock selectedItem={selectedItem} items={dockLinks} />
            </div>
          </div>
        </div>

        <SearchModal
          isOpen={isSearchbarModalOpen}
          setIsOpen={setIsSearchbarModalOpen}
          type={currentType}
        />
      </main>
    </LayoutContext.Provider>
  );
}
