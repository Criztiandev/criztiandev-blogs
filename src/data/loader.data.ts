import { getRandomPosition } from "@/utils/position.utils";
import { ContentType } from "@/lib/content/get-content";

export const loaderData = (type: ContentType) =>
  Array.from({ length: 9 }, (_, i) => ({
    id: `skeleton-${i}`,
    title: `skeleton-title-${i}`,
    src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E",
    className: `absolute ${getRandomPosition(i)}`,
    slug: `skeleton-slug-${i}`,
    description: "",
    tags: [],
    date: "",
    type: type as "blog" | "project" | "aboutme",
    responsibilities: [],
    htmlContent: "",
    isSkeleton: true,
  }));
