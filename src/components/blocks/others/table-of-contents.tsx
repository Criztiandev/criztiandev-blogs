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
      <div className="bg-muted rounded p-4">
        <p className="text-muted-foreground text-sm">No headings found</p>
      </div>
    );
  }

  return (
    <nav className="sticky top-8">
      <h2 className="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
        Table of Contents
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "hover:text-foreground block py-1 transition-colors",
                activeId === heading.id
                  ? "text-foreground border-foreground border-l-2 pl-3 font-medium"
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
