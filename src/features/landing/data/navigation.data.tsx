import { IFloatingDockItems } from "@/components/ui/floating-dock";
import { IconHome, IconNewSection, IconTerminal2 } from "@tabler/icons-react";
import { Search, Wrench } from "lucide-react";

interface Props {
  onLayoutToggle: () => void;
  onContentFilter: (filter: "blogs" | "projects" | "tools") => void;
  onSearch: () => void;
  layoutMode: "free-space" | "grid";
  contentFilter: "blogs" | "projects";
}

const NavigationData = ({
  onLayoutToggle,
  onContentFilter,
  onSearch,
  layoutMode,
}: Props): IFloatingDockItems[] => {
  return [
    {
      id: "blogs",
      title: "Blogs",
      type: "button",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => onContentFilter("blogs"),
    },
    // {
    //   id: "projects",
    //   title: "Projects",
    //   type: "button",
    //   icon: (
    //     <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   onClick: () => onContentFilter("projects"),
    // },

    // {
    //   id: "tools",
    //   title: "Tools",
    //   type: "button",
    //   icon: (
    //     <Wrench className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    //   ),
    //   onClick: () => onContentFilter("tools"),
    // },
    {
      id: "search",
      title: "Search",
      type: "button",
      icon: (
        <Search className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: onSearch,
    },
    {
      id: layoutMode === "grid" ? "free-space" : "grid",
      title: layoutMode === "grid" ? "Free Space" : "Grid",
      type: "button",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: onLayoutToggle,
    },
  ];
};

export default NavigationData;
