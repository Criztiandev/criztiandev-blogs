"use client";

import { PropsWithChildren, useEffect } from "react";
import { gsap } from "gsap";

interface BounceCardsProps extends PropsWithChildren {
  className?: string;
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}

export default function BounceCards({
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  children,
}: BounceCardsProps) {
  useEffect(() => {
    gsap.fromTo(
      ".card",
      { scale: 0 },
      {
        scale: 1,
        stagger: animationStagger,
        ease: easeType,
        delay: animationDelay,
      }
    );
  }, [animationDelay, animationStagger, easeType]);

  return <div className="card">{children}</div>;
}
