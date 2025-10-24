"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface LikeButtonProps {
  slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch like count from database
  const { data, refetch } = trpc.engagement.like.get.useQuery(
    { slug },
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // Consider fresh for 1 minute
    }
  );

  const likeCount = data?.count ?? 0;

  // Toggle like mutation
  const toggleLikeMutation = trpc.engagement.like.toggle.useMutation({
    onSuccess: () => {
      // Refetch to get updated count from server
      refetch();
    },
    onError: (error) => {
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      toast.error("Failed to update like. Please try again.");
      console.error("Like error:", error);
    },
  });

  // Load user's like state from localStorage on mount
  useEffect(() => {
    const liked = localStorage.getItem(`liked_${slug}`) === "true";
    setIsLiked(liked);
  }, [slug]);

  const handleLike = async () => {
    // Prevent double-clicking
    if (isLoading || toggleLikeMutation.isPending) return;

    setIsLoading(true);

    try {
      // Optimistic update
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      // Save to localStorage
      localStorage.setItem(`liked_${slug}`, String(newLikedState));

      // Call server
      await toggleLikeMutation.mutateAsync({
        slug,
        increment: newLikedState ? 1 : -1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPending = isLoading || toggleLikeMutation.isPending;

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className="group mt-8 flex items-center gap-3 transition-opacity disabled:cursor-not-allowed"
      style={{ opacity: isPending ? 0.5 : 1 }}
      aria-label={isLiked ? "Unlike this post" : "Like this post"}
    >
      <div
        className={`relative transition-all ${
          isLiked ? "text-pink-500" : "text-muted-foreground group-hover:text-pink-400"
        }`}
      >
        <Heart
          className={`h-10 w-10 transition-all ${
            isLiked ? "scale-110 fill-pink-500" : "group-hover:scale-110"
          }`}
        />
      </div>
      <span className="text-foreground text-2xl font-bold">{likeCount.toLocaleString()}</span>
    </button>
  );
}
