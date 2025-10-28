"use client";

import * as React from "react";
import { Hash, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { trpc } from "@/lib/trpc";
import type { ContentType } from "@/lib/content/get-content";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type?: ContentType;
}

export default function SearchModal({ isOpen, setIsOpen, type = "blog" }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch content by type for search
  const { data } = trpc.content.list.useInfiniteQuery(
    { type, limit: 100 }, // Get more for search
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: isOpen, // Only fetch when modal is open
    }
  );

  const allContent = React.useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

  // Extract unique tags from all content
  const allTags = React.useMemo(() => {
    const tags = allContent.flatMap((item) => item.tags || []);
    return [...new Set(tags)];
  }, [allContent]);

  // Filter content by search query (title + tags)
  const filteredContent = React.useMemo(() => {
    if (!searchQuery) return allContent.slice(0, 5); // Show first 5 if no search

    const query = searchQuery.toLowerCase();
    return allContent.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesTags = item.tags?.some((tag) => tag.toLowerCase().includes(query));
      return matchesTitle || matchesTags;
    });
  }, [allContent, searchQuery]);

  // Filter tags by search query
  const filteredTags = React.useMemo(() => {
    if (!searchQuery) return allTags.slice(0, 8); // Show first 8 if no search

    const query = searchQuery.toLowerCase();
    return allTags.filter((tag) => tag.toLowerCase().includes(query));
  }, [allTags, searchQuery]);

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsOpen]);

  const handleContentSelect = (slug: string) => {
    const typeRoute = type === "blog" ? "blogs" : type === "project" ? "projects" : "about";
    router.push(`/${typeRoute}/${slug}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleTagSelect = (tag: string) => {
    setSearchQuery(tag);
  };

  const contentLabel = type === "blog" ? "Blogs" : type === "project" ? "Projects" : "About Me";
  const placeholderText = `Search ${contentLabel.toLowerCase()} or filter by tags...`;

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput
        placeholder={placeholderText}
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Tags Section */}
        {filteredTags.length > 0 && (
          <>
            <CommandGroup heading="Tags">
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => handleTagSelect(tag)}
                  className="cursor-pointer"
                >
                  <Hash size={16} className="opacity-60" aria-hidden="true" />
                  <span>{tag}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Content Section */}
        {filteredContent.length > 0 && (
          <CommandGroup heading={contentLabel}>
            {filteredContent.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleContentSelect(item.slug)}
                className="cursor-pointer"
              >
                <FileText size={16} className="opacity-60" aria-hidden="true" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {item.tags && item.tags.length > 0 && (
                    <span className="text-muted-foreground text-xs">{item.tags.join(", ")}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
