"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress based on loading events
    const updateProgress = () => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.random() * 15;
        }
        return prev;
      });
    };

    const interval = setInterval(updateProgress, 100);

    // Set to 100% when actually loaded
    const handleLoad = () => {
      setProgress(100);
      clearInterval(interval);
      setTimeout(() => {
        onComplete?.();
      }, 200);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handleLoad);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="bg-background fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="w-full max-w-md px-8">
        {/* Logo/Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-permanent-marker mb-12 text-center text-5xl font-bold sm:text-6xl"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Criztiandev
        </motion.h1>

        {/* Progress Bar Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-muted relative h-2 overflow-hidden rounded-full"
        >
          {/* Background shimmer effect */}
          <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Progress fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
            className="from-primary via-primary/80 to-primary relative h-full overflow-hidden rounded-full bg-gradient-to-r"
          >
            {/* Animated glow effect */}
            <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Percentage */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-muted-foreground mt-4 text-center text-sm font-medium tabular-nums"
        >
          {Math.round(progress)}%
        </motion.p>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-muted-foreground mt-2 text-center text-xs tracking-wider uppercase"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}

// Add shimmer animation to globals.css or use inline keyframes
