"use client";

import { createContext, useContext } from "react";

interface LayoutContextType {
  layoutMode: "free-space" | "grid";
}

export const LayoutContext = createContext<LayoutContextType>({
  layoutMode: "free-space",
});

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within LayoutProvider");
  }
  return context;
};
