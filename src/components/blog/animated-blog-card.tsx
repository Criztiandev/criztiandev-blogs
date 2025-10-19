"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import Image from "next/image";

interface AnimatedBlogCardProps {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image: string;
  tags?: string[];
  date?: string;
  index: number;
}

export function AnimatedBlogCard({
  slug,
  title,
  description,
  image,
  tags,
  date,
  index,
}: AnimatedBlogCardProps) {
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
      className="group"
    >
      <Link href={`/blogs/${slug}`} className="block">
        <article className="h-full bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
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

            {/* Title */}
            <h3 className="text-xl font-bold tracking-tight leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
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
        </article>
      </Link>
    </motion.div>
  );
}
