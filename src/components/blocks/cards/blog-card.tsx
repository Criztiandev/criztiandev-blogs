"use client";

import { IProjects } from "@/features/landing/data/projects.data";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface BlogCardProps {
  data: IProjects & {
    tags?: string[];
    description?: string;
    date?: string;
    isSkeleton?: boolean;
  };
  onClick?: () => void;
  variant?: "draggable" | "grid";
  className?: string;
}

const BlogCard = ({ data, onClick, variant = "draggable", className }: BlogCardProps) => {
  // Calculate reading time (simplified)
  const readingTime = 3;

  // Format date
  const formattedDate = data.date
    ? new Date(data.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  if (variant === "draggable") {
    // Skeleton state for draggable card
    if (data.isSkeleton) {
      return (
        <div className={className}>
          <div className="h-[500px]">
            <div className="bg-card relative flex h-full flex-col overflow-hidden rounded-lg border">
              {/* Image skeleton */}
              <div className="bg-muted relative h-[240px] flex-shrink-0 animate-pulse" />

              {/* Content skeleton */}
              <div className="flex flex-1 flex-col p-4">
                {/* Tags skeleton */}
                <div className="mb-3 flex flex-wrap gap-2">
                  <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
                  <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
                </div>

                {/* Title skeleton */}
                <div className="mb-3 space-y-2">
                  <div className="bg-muted h-6 w-full animate-pulse rounded" />
                  <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
                </div>

                {/* Description skeleton */}
                <div className="mb-4 flex-1 space-y-2">
                  <div className="bg-muted h-4 w-full animate-pulse rounded" />
                  <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
                </div>

                {/* Metadata skeleton */}
                <div className="mt-auto flex items-center gap-4 border-t pt-3">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        onClick={onClick}
        className={className}
        whileHover={{ scale: 1.02, rotate: 0 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <div className="h-[500px] cursor-pointer">
          {/* Card with fixed height */}
          <div className="bg-card relative flex h-full flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl">
            {/* Image - Fixed height */}
            <div className="bg-muted relative h-[240px] flex-shrink-0 overflow-hidden">
              <Image
                src={data.src}
                alt={data.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                unoptimized
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </div>

            {/* Content - Flexible height with padding */}
            <div className="flex flex-1 flex-col p-4">
              {/* Tags */}
              {data.tags && data.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {data.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title - Fixed line clamp */}
              <h3 className="hover:text-primary mb-3 line-clamp-2 text-xl leading-tight font-bold tracking-tight transition-colors">
                {data.title}
              </h3>

              {/* Description - Fixed line clamp */}
              {data.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
                  {data.description}
                </p>
              )}

              {/* Metadata - Always at bottom */}
              <div className="text-muted-foreground mt-auto flex items-center gap-4 border-t pt-3 text-xs">
                {formattedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid variant
  return (
    <div onClick={onClick} className={className}>
      <Image
        src={data.src}
        alt={data.title}
        fill
        className="absolute inset-0 object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        unoptimized
      />
    </div>
  );
};

export default BlogCard;
