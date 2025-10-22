import ContentPageClient from "./content-page-client";
import type { ContentPost, ContentType } from "@/lib/content/get-content";

interface AboutPageClientProps {
  initialData: {
    items: ContentPost[];
    nextCursor?: number;
  };
  GridCardComponent?: React.ComponentType<{
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
  DraggableCardComponent?: React.ComponentType<{
    data: {
      id: string;
      title: string;
      src: string;
      className: string;
      slug?: string;
      description?: string;
      tags?: string[];
      date?: string;
      type?: ContentType;
      responsibilities?: string[];
      htmlContent?: string;
    };
    onClick: () => void;
    variant?: string;
  }>;
}

export default function AboutPageClient(props: AboutPageClientProps) {
  return <ContentPageClient type="aboutme" {...props} />;
}
