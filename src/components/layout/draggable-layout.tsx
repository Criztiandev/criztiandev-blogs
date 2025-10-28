"use client";

import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { IProjects } from "@/features/landing/data/projects.data";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import BlogCard from "@/components/blocks/cards/blog-card";

type ContentType = "blog" | "project" | "aboutme";

interface Props {
  payload: (IProjects & { slug?: string; type?: ContentType })[];
  type?: ContentType;
  CardComponent?: React.ComponentType<{
    data: IProjects & { slug?: string; type?: ContentType };
    onClick: () => void;
    variant?: string;
  }>;
}

const DraggableLayout = ({ payload, type = "blog", CardComponent }: Props) => {
  const router = useRouter();
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardClick = (item: IProjects & { slug?: string; type?: ContentType }) => {
    // Only navigate if not dragging
    if (!draggingCard) {
      const itemType = item.type || type;
      const slug = item.slug || item.id;

      // Generate correct route based on content type
      const typeRoutes: Record<ContentType, string> = {
        blog: "blogs",
        project: "projects",
        aboutme: "about",
      };

      // Don't navigate for aboutme (no detail pages)
      if (itemType !== "aboutme") {
        router.push(`/${typeRoutes[itemType]}/${slug}`);
      }
    }
  };

  // Get the label for the content type
  const typeLabels: Record<ContentType, string> = {
    blog: "Blogs",
    project: "Projects",
    aboutme: "About Me",
  };

  return (
    <DraggableCardContainer className="relative flex h-full w-full items-center justify-center overflow-clip">
      <p className="absolute top-1/2 mx-auto -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
        <span className="font-permanent-marker text-muted-foreground text-[120px]">
          {typeLabels[type]}
        </span>
      </p>
      {payload.map((item, index) => {
        const Card = CardComponent || BlogCard;
        const cardId = item.id || item.title;
        // Calculate z-index: first item (latest) gets highest z-index
        const baseZIndex = payload.length - index;
        return (
          <DraggableCardBody
            key={item.title}
            className={item.className}
            zIndex={baseZIndex}
            onDragStart={() => setDraggingCard(cardId)}
            onDragEnd={() => setDraggingCard(null)}
            isAboutPage={type === "aboutme"}
            isSelected={selectedCard === cardId}
            onSelect={() => setSelectedCard(cardId)}
          >
            <Card data={item} onClick={() => handleCardClick(item)} variant="draggable" />
          </DraggableCardBody>
        );
      })}
    </DraggableCardContainer>
  );
};

export default DraggableLayout;
