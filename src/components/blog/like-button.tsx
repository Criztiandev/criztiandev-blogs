"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(15995);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-3 mt-8 group"
    >
      <div
        className={`relative transition-all ${
          isLiked
            ? "text-pink-500"
            : "text-muted-foreground group-hover:text-pink-400"
        }`}
      >
        <Heart
          className={`w-10 h-10 transition-all ${
            isLiked ? "fill-pink-500 scale-110" : "group-hover:scale-110"
          }`}
        />
      </div>
      <span className="text-2xl font-bold text-foreground">
        {likes.toLocaleString()}
      </span>
    </button>
  );
}
