"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import Image from "next/image";
import { usePrefetchContent } from "@/hooks/use-prefetch-content";

interface AnimatedBlogCardProps {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image: string;
  tags?: string[];
  date?: string;
  index: number;
  type?: "blog" | "project" | "aboutme";
  isSkeleton?: boolean;
}

export function AnimatedBlogCard({
  slug,
  title,
  description,
  image,
  tags,
  date,
  index,
  type = "blog",
  isSkeleton = false,
}: AnimatedBlogCardProps) {
  const { prefetchBlog, prefetchContent } = usePrefetchContent();

  // Prefetch content on hover for instant navigation
  const handleMouseEnter = () => {
    if (type === "blog") {
      prefetchBlog(slug);
    } else if (type === "project") {
      prefetchContent(type, slug);
    }
  };

  // Calculate reading time (simplified, ~200 words per min, estimate 3 min for avg blog)
  const readingTime = 3;

  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Generate the correct link based on content type
  const typeRoutes = {
    blog: "blogs",
    project: "projects",
    aboutme: "about", // About doesn't have detail pages
  };
  const linkHref = type === "aboutme" ? "#" : `/${typeRoutes[type]}/${slug}`;

  // Skeleton card
  if (isSkeleton) {
    return (
      <div className="group">
        <article className="bg-card h-full overflow-hidden rounded-lg border">
          {/* Image skeleton */}
          <div className="bg-muted relative aspect-[16/9] animate-pulse" />

          {/* Content skeleton */}
          <div className="space-y-4 p-6">
            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
              <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="bg-muted h-6 w-full animate-pulse rounded" />
              <div className="bg-muted h-6 w-3/4 animate-pulse rounded" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="bg-muted h-4 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-5/6 animate-pulse rounded" />
            </div>

            {/* Metadata skeleton */}
            <div className="flex items-center gap-4 border-t pt-2">
              <div className="bg-muted h-4 w-24 animate-pulse rounded" />
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            </div>
          </div>
        </article>
      </div>
    );
  }

  const cardContent = (
    <article className="bg-card h-full overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      {image && (
        <div className="bg-muted relative aspect-[16/9] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-4 p-6">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="group-hover:text-primary line-clamp-2 text-xl leading-tight font-bold tracking-tight transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {description}
          </p>
        )}

        {/* Metadata */}
        <div className="text-muted-foreground flex items-center gap-4 border-t pt-2 text-xs">
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
    </article>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -4 }}
      onMouseEnter={handleMouseEnter}
      className="group"
    >
      {type === "aboutme" ? (
        cardContent
      ) : (
        <Link href={linkHref} className="block">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}
