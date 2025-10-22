import { IFloatingDockItems } from "@/components/ui/floating-dock";
import { IconHome, IconNewSection, IconTerminal2, IconUser } from "@tabler/icons-react";
import { Search } from "lucide-react";

interface Props {
  onLayoutToggle: () => void;
  onSearch: () => void;
  layoutMode: "free-space" | "grid";
}

const NavigationData = ({ onLayoutToggle, onSearch, layoutMode }: Props): IFloatingDockItems[] => {
  return [
    {
      id: "blogs",
      title: "Blogs",
      type: "link",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/blogs",
    },
    {
      id: "projects",
      title: "Projects",
      type: "link",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/projects",
    },
    {
      id: "about",
      title: "About",
      type: "link",
      icon: <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/about",
    },
    {
      id: "search",
      title: "Search",
      type: "button",
      icon: <Search className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: onSearch,
    },
    {
      id: layoutMode === "grid" ? "free-space" : "grid",
      title: layoutMode === "grid" ? "Free Space" : "Grid",
      type: "button",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      onClick: onLayoutToggle,
    },
  ];
};

export default NavigationData;
