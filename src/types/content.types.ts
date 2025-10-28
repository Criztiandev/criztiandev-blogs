import { ContentPost, ContentType } from "@/lib/content/get-content";

export interface ContentInitialData {
  items: ContentPost[];
  nextCursor?: number;
}

export interface GridCardComponent {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image: string;
  tags?: string[];
  date?: string;
  index: number;
  type: ContentType;
  isSkeleton?: boolean;
}

export interface DraggableCardComponent {
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
}
