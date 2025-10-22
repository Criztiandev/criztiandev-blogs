"use client";

import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  label?: string;
  title: string;
  slug: string;
}

export function ShareButtons({ label = "Share this Article", title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  // Set URL after component mounts (client-side only)
  useEffect(() => {
    setUrl(`${window.location.origin}/blogs/${slug}`);
  }, [slug]);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-muted/30 flex flex-col items-start justify-between gap-4 rounded-lg border p-6 sm:flex-row sm:items-center">
      <div className="flex-1">
        <h3 className="mb-1 text-lg font-semibold">{label}</h3>
        <p className="text-muted-foreground text-sm">Help others discover this content</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Copy Link Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={copyLink}
          className="group relative"
          title="Copy link"
        >
          <Share2 className="h-4 w-4" />
          {copied && (
            <span className="bg-foreground text-background absolute -top-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap">
              Copied!
            </span>
          )}
        </Button>

        {/* Twitter */}
        <Button variant="outline" size="icon" asChild title="Share on Twitter">
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>

        {/* LinkedIn */}
        <Button variant="outline" size="icon" asChild title="Share on LinkedIn">
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:border-blue-700/50 hover:bg-blue-700/10 hover:text-blue-700"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>

        {/* Facebook */}
        <Button variant="outline" size="icon" asChild title="Share on Facebook">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:border-blue-600/50 hover:bg-blue-600/10 hover:text-blue-600"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
