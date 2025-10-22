"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AboutMeCardProps {
  title: string;
  summary: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

export function AboutMeCard({
  title,
  summary,
  content,
  icon,
  color = "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30",
}: AboutMeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`${color} group relative w-[280px] cursor-pointer overflow-hidden rounded-lg border-2 border-orange-200 shadow-lg transition-shadow duration-300 hover:shadow-2xl dark:border-orange-800`}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      transition={{
        layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.2 },
      }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {icon && (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-700 dark:text-orange-300">
              {icon}
            </div>
          )}
          <h3 className="truncate text-sm font-bold text-orange-900 dark:text-orange-100">
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex-shrink-0 text-orange-600 dark:text-orange-400"
        >
          <ChevronDown size={16} />
        </motion.div>
      </div>

      {/* Summary - Only show when collapsed */}
      <AnimatePresence mode="wait">
        {!isExpanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden px-3 pb-3 text-xs text-orange-800 dark:text-orange-200"
          >
            <span className="line-clamp-1">{summary}</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Expanded Content */}
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
            <div className="max-h-[400px] overflow-y-auto border-t-2 border-orange-200 px-3 pt-3 pb-3 dark:border-orange-700">
              <div className="prose prose-xs dark:prose-invert prose-headings:text-xs prose-headings:text-orange-900 dark:prose-headings:text-orange-100 prose-p:text-xs prose-p:text-orange-800 dark:prose-p:text-orange-200 prose-li:text-xs prose-li:text-orange-800 dark:prose-li:text-orange-200 prose-strong:text-orange-900 dark:prose-strong:text-orange-100 prose-ul:my-1 prose-li:my-0 max-w-none">
                {content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
