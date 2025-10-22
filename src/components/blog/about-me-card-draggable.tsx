"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

interface AboutMeCardDraggableProps {
  data: {
    id: string;
    title: string;
    src: string;
    className?: string;
    slug?: string;
    description?: string;
    tags?: string[];
    date?: string;
    type?: string;
    responsibilities?: string[];
    htmlContent?: string;
  };
  onClick?: () => void;
  variant?: string;
}

export function AboutMeCardDraggable({ data }: AboutMeCardDraggableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="group bg-card w-[500px] cursor-pointer overflow-hidden rounded-lg border shadow-lg transition-shadow duration-300 hover:shadow-2xl"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{
        scale: { duration: 0.2 },
      }}
    >
      {/* Image - Only show if provided and not empty */}
      {data.src && data.src.trim() !== "" && (
        <div className="bg-muted relative h-32 overflow-hidden">
          <Image
            src={data.src}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      )}

      {/* Compact Content - Minimal padding */}
      <div className="p-3">
        {/* Title with expand icon - Single line */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 flex-wrap text-lg leading-tight font-bold">{data.title}</h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground flex-shrink-0"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>

        {/* Description - Only 1 line when collapsed */}
        {!isExpanded && data.description && (
          <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{data.description}</p>
        )}

        {/* Expanded Content */}
        <div>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
                className="overflow-hidden"
              >
                <ScrollArea>
                  <div className="text-muted-foreground mt-2 flex max-h-[250px] flex-col gap-3 border-t pt-3">
                    {data.htmlContent ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: data.htmlContent }}
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No content available</p>
                    )}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
