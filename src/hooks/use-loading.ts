"use client";

import { useState, useEffect } from "react";

export function useLoading(initialDelay = 100) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load
    const hasLoaded = sessionStorage.getItem("hasLoadedBefore");

    if (hasLoaded) {
      // Skip loading screen on subsequent navigations
      setIsLoading(false);
      setIsInitialLoad(false);
    } else {
      // Show loading screen on first load
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasLoadedBefore", "true");
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [initialDelay]);

  return { isLoading: isLoading && isInitialLoad, isInitialLoad };
}
