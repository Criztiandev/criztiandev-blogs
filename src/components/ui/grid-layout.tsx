"use client";

import React from "react";
import { ScrollArea } from "./scroll-area";
import { AnimatedBlogCard } from "@/components/blog/animated-blog-card";

type CardType = {
  title: string;
  src: string;
  id: string;
  slug?: string;
  description?: string;
  tags?: string[];
  date?: string;
  type?: "blog" | "project" | "aboutme";
};

interface GridLayoutProps {
  cards: CardType[];
  type?: "blog" | "project" | "aboutme";
  CardComponent?: React.ComponentType<{
    id: string;
    slug: string;
    title: string;
    description?: string;
    image: string;
    tags?: string[];
    date?: string;
    index: number;
    type: "blog" | "project" | "aboutme";
  }>;
}

export function GridLayout({ cards, type, CardComponent }: GridLayoutProps) {
  const Card = CardComponent || AnimatedBlogCard;

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-8 pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              id={card.id}
              slug={card.slug || card.id}
              title={card.title}
              description={card.description}
              image={card.src}
              tags={card.tags}
              date={card.date}
              index={index}
              type={type || card.type || "blog"}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
