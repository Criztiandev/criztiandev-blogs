"use client";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { useLoading } from "@/hooks/use-loading";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <LoadingScreen />}
      {children}
    </>
  );
}
