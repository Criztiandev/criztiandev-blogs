import { ContentGrid } from "@/components/layout/content-grid";
import { AboutMeCardDraggable } from "@/components/blocks/cards/about-me-card-draggable";

export default function AboutPage() {
  return <ContentGrid type="aboutme" DraggableCardComponent={AboutMeCardDraggable} />;
}
