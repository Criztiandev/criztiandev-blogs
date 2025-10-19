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
  };
  onClick?: () => void;
  variant?: "draggable" | "grid";
  className?: string;
}

const BlogCard = ({
  data,
  onClick,
  variant = "draggable",
  className,
}: BlogCardProps) => {
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
          <div className="relative h-full bg-card border rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
            {/* Image - Fixed height */}
            <div className="relative h-[240px] overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={data.src}
                alt={data.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                unoptimized
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content - Flexible height with padding */}
            <div className="p-4 flex flex-col flex-1">
              {/* Tags */}
              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title - Fixed line clamp */}
              <h3 className="text-xl font-bold tracking-tight leading-tight line-clamp-2 mb-3 hover:text-primary transition-colors">
                {data.title}
              </h3>

              {/* Description - Fixed line clamp */}
              {data.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                  {data.description}
                </p>
              )}

              {/* Metadata - Always at bottom */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t mt-auto">
                {formattedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
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
        className="object-cover absolute inset-0"
        sizes="(max-width: 768px) 100vw, 33vw"
        unoptimized
      />
    </div>
  );
};

export default BlogCard;
