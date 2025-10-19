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
};

export function GridLayout({ cards }: { cards: CardType[] }) {
  return (
    <ScrollArea className="w-full h-full">
      <div className="p-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <AnimatedBlogCard
              key={card.id}
              id={card.id}
              slug={card.slug || card.id}
              title={card.title}
              description={card.description}
              image={card.src}
              tags={card.tags}
              date={card.date}
              index={index}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
