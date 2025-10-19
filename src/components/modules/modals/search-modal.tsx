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

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchModal({ isOpen, setIsOpen }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch all blogs for search
  const { data } = trpc.blog.list.useInfiniteQuery(
    { limit: 100 }, // Get more for search
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: isOpen, // Only fetch when modal is open
    }
  );

  const allBlogs = React.useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );

  // Extract unique tags from all blogs
  const allTags = React.useMemo(() => {
    const tags = allBlogs.flatMap((blog) => blog.tags || []);
    return [...new Set(tags)];
  }, [allBlogs]);

  // Filter blogs by search query (title + tags)
  const filteredBlogs = React.useMemo(() => {
    if (!searchQuery) return allBlogs.slice(0, 5); // Show first 5 if no search

    const query = searchQuery.toLowerCase();
    return allBlogs.filter((blog) => {
      const matchesTitle = blog.title.toLowerCase().includes(query);
      const matchesTags = blog.tags?.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      return matchesTitle || matchesTags;
    });
  }, [allBlogs, searchQuery]);

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

  const handleBlogSelect = (slug: string) => {
    router.push(`/blogs/${slug}`);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleTagSelect = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput
        placeholder="Search blogs or filter by tags..."
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

        {/* Blogs Section */}
        {filteredBlogs.length > 0 && (
          <CommandGroup heading="Blogs">
            {filteredBlogs.map((blog) => (
              <CommandItem
                key={blog.id}
                onSelect={() => handleBlogSelect(blog.slug)}
                className="cursor-pointer"
              >
                <FileText size={16} className="opacity-60" aria-hidden="true" />
                <div className="flex flex-col">
                  <span>{blog.title}</span>
                  {blog.tags && blog.tags.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {blog.tags.join(", ")}
                    </span>
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
