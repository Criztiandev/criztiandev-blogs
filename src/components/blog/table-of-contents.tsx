"use client";

import { TocItem } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: TocItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return (
      <div className="p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">No headings found</p>
      </div>
    );
  }

  return (
    <nav className="sticky top-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
        Table of Contents
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1 transition-colors hover:text-foreground",
                activeId === heading.id
                  ? "text-foreground font-medium border-l-2 border-foreground pl-3"
                  : "text-muted-foreground border-l-2 border-transparent pl-3"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
