"use client";

import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { IProjects } from "@/features/landing/data/projects.data";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import BlogCard from "./blog-card";

interface Props {
  payload: IProjects[];
}

const DraggableLayout = ({ payload }: Props) => {
  const router = useRouter();
  const [draggingCard, setDraggingCard] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    // Only navigate if not dragging
    if (!draggingCard) {
      router.push(`/blogs/${id}`);
    }
  };

  return (
    <DraggableCardContainer className="relative flex h-full w-full items-center justify-center overflow-clip">
      <p className="absolute top-1/2 mx-auto -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800 ">
        <span className="text-[120px] font-permanent-marker text-muted-foreground">
          Blogs
        </span>
      </p>
      {payload.map((item) => (
        <DraggableCardBody
          key={item.title}
          className={item.className}
          onDragStart={() => setDraggingCard(item.title)}
          onDragEnd={() => setTimeout(() => setDraggingCard(null), 100)}
        >
          <BlogCard
            data={item}
            onClick={() => handleCardClick(item.id)}
            variant="draggable"
          />
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
};

export default DraggableLayout;
