import { cn } from "@/lib/utils";

interface TwoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function TwoGrid({ children, className }: TwoGridProps) {
  return <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2", className)}>{children}</div>;
}
