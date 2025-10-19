"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Lightbulb } from "lucide-react";
import { useChatForm } from "./chat-form-context";

interface TextSelectionTooltipProps {
  x: number;
  y: number;
  text: string;
  onClose: () => void;
}

export default function TextSelectionTooltip({
  x,
  y,
  text,
  onClose,
}: TextSelectionTooltipProps) {
  const [showCopied, setShowCopied] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { methods, onExplainText } = useChatForm();

  // Prevent click events from bubbling to parent
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add listener with a small delay to prevent immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleExplain = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Set the message in the form
    const message = `Explain this: "${text}"`;
    methods.setValue("message", message);

    // Trigger the explain action
    onExplainText(text);

    // Close the tooltip
    onClose();
  };

  const handleShareOnX = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const xText = `"${text}"\n\nRead more on my blog`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`;
    window.open(xUrl, "_blank");
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div
      ref={tooltipRef}
      data-tooltip="true"
      className="absolute z-50 bg-card border border-border rounded-lg shadow-lg p-2 flex gap-2 backdrop-blur-sm select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -100%)",
        userSelect: "none",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleExplain}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium select-none"
        title="Explain this text"
      >
        <Lightbulb size={16} />
        Explain
      </button>

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleShareOnX}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors text-sm font-medium border border-border select-none"
        title="Share on X"
      >
        <Share2 size={16} />
        {showCopied ? "Shared!" : "Share"}
      </button>
    </div>
  );
}
