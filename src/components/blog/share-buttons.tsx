"use client";

import { Button } from "@/components/ui/button";
import { Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
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
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border rounded-lg bg-muted/30">
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">Share this article</h3>
        <p className="text-sm text-muted-foreground">
          Help others discover this content
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Copy Link Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={copyLink}
          className="relative group"
          title="Copy link"
        >
          <Share2 className="h-4 w-4" />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </Button>

        {/* Twitter */}
        <Button
          variant="outline"
          size="icon"
          asChild
          title="Share on Twitter"
        >
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50 transition-colors"
          >
            <Twitter className="h-4 w-4" />
          </a>
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="icon"
          asChild
          title="Share on LinkedIn"
        >
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-blue-700/10 hover:text-blue-700 hover:border-blue-700/50 transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>

        {/* Facebook */}
        <Button
          variant="outline"
          size="icon"
          asChild
          title="Share on Facebook"
        >
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/50 transition-colors"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
