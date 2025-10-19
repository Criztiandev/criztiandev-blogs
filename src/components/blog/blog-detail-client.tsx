"use client";

import { trpc } from "@/lib/trpc";
import { calculateReadingTime, formatDate } from "@/lib/blog/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, MessageCircle } from "lucide-react";
import { ShareButtons } from "./share-buttons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";
import { Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ChatBot from "./chat-bot";
import TextSelectionTooltip from "./text-selection-tooltip";
import { ChatFormProvider } from "./chat-form-context";

interface BlogDetailClientProps {
  slug: string;
  initialData: {
    slug: string;
    frontmatter: Record<string, unknown>;
    markdownContent: string;
    headings: Array<{ id: string; text: string; level: number }>;
    rawContent: string;
  };
}

export function BlogDetailClient({ slug, initialData }: BlogDetailClientProps) {
  const { data } = trpc.blog.getBySlug.useQuery(
    { slug },
    {
      initialData,
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    }
  );

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectionTooltip, setSelectionTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState<
    string | undefined
  >(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const selectionRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      // Only show tooltip if selection is within the content area
      if (
        text &&
        text.length > 0 &&
        contentRef.current?.contains(selection?.anchorNode || null)
      ) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        // Save the range so we can restore the selection later
        selectionRangeRef.current = range?.cloneRange() || null;

        if (rect) {
          setSelectionTooltip({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - 10,
            text: text,
          });

          // Keep the selection active
          setTimeout(() => {
            if (selectionRangeRef.current) {
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(selectionRangeRef.current);
            }
          }, 0);
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isTooltip = target.closest('[data-tooltip="true"]');

      if (!isTooltip) {
        setSelectionTooltip(null);
        selectionRangeRef.current = null;
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const handleExplainText = (text: string) => {
    console.log("Explaining text:", text);
    const message = `Explain this: "${text}"`;
    console.log("Setting initial message:", message);
    setChatInitialMessage(message);
    setIsChatOpen(true);
  };

  if (!data) return null;

  // Extract frontmatter values with proper typing
  const title = data.frontmatter.title as string;
  const description = data.frontmatter.description as string;
  const tags = data.frontmatter.tags as string[] | undefined;
  const image = data.frontmatter.image as string | undefined;
  const author = data.frontmatter.author as string | undefined;
  const date = data.frontmatter.date as string;

  const readingTime = calculateReadingTime(data.rawContent);
  const formattedDate = formatDate(date);

  return (
    <ChatFormProvider onExplainText={handleExplainText}>
      <div className="min-h-screen bg-background">
        {/* Fixed header with back button */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:gap-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-20">
          <article>
            {/* Hero section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                {author && (
                  <div className="flex items-center gap-2">
                    <span>by</span>
                    <span className="font-medium text-foreground">
                      {author}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Wide hero image */}
            {image && (
              <div className="relative w-full aspect-[21/9] max-w-7xl mx-auto mb-16 overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}

            {/* Article content */}
            <div
              ref={contentRef}
              className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
            >
              {/* Markdown content rendered with ReactMarkdown */}
              <div
                className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-4
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-2
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-base prose-p:leading-8 prose-p:mb-6
                  prose-li:text-base prose-li:leading-7
                  prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-lg
                  prose-strong:font-bold prose-strong:text-foreground
                  prose-em:italic
                  prose-code:text-sm prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-4xl font-bold mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <h2
                          id={id}
                          className="text-3xl font-bold mt-12 mb-6 border-b pb-2"
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <h3 id={id} className="text-2xl font-bold mt-8 mb-4">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-base leading-8 mb-6">{children}</p>
                    ),
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "";
                      const isInline = !className;

                      if (isInline) {
                        return (
                          <code
                            className="text-sm bg-muted px-2 py-1 rounded"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }

                      const code = String(children).replace(/\n$/, "");
                      return (
                        <div className="my-6">
                          <CodeBlock
                            language={language}
                            filename={`code.${language}`}
                            code={code}
                          />
                        </div>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="relative border-l-4 border-blue-500 bg-[#1a2332] rounded-r-lg pl-6 pr-6 py-6 my-8 not-italic">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                              <Info className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 text-base leading-7 text-gray-300">
                            {children}
                          </div>
                        </div>
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside ml-6 space-y-3 my-6">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside ml-6 space-y-3 my-6">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-base leading-7 pl-2">{children}</li>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        className="text-primary no-underline font-medium hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => {
                      if (typeof src !== "string") return null;
                      return (
                        <Image
                          src={src}
                          alt={alt || ""}
                          width={800}
                          height={400}
                          className="rounded-lg shadow-lg my-6"
                        />
                      );
                    },
                  }}
                >
                  {data.markdownContent}
                </ReactMarkdown>
              </div>

              {/* Share buttons */}
              <div className="mt-12">
                <ShareButtons title={title} slug={slug} />
              </div>

              {/* Footer section with tags */}
              {tags && tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                    Tagged with
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* AI Chat Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 z-30 p-4 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-all hover:scale-110"
            aria-label="Open AI Assistant"
          >
            <MessageCircle size={24} />
          </button>

          {/* ChatBot */}
          <ChatBot
            isOpen={isChatOpen}
            onClose={() => {
              setIsChatOpen(false);
              setChatInitialMessage(undefined);
            }}
            blogTitle={title}
            blogContent={data.rawContent}
            initialMessage={chatInitialMessage}
          />

          {/* Text Selection Tooltip */}
          {selectionTooltip && (
            <TextSelectionTooltip
              x={selectionTooltip.x}
              y={selectionTooltip.y}
              text={selectionTooltip.text}
              onClose={() => setSelectionTooltip(null)}
            />
          )}
        </main>
      </div>
    </ChatFormProvider>
  );
}
