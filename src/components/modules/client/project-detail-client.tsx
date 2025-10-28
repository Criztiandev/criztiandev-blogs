"use client";

import { calculateReadingTime, formatDate } from "@/lib/blog/utils";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { ShareButtons } from "../../blocks/button/share-buttons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";
import { Info } from "lucide-react";
import AIChatButton from "../../blocks/button/ai-chat-button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export function ProjectDetailClient({ slug, initialData }: BlogDetailClientProps) {
  // Use data directly from props (already fetched in wrapper)
  const data = initialData;

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
    <ScrollArea className="h-screen w-full">
      <div className="bg-background min-h-screen">
        {/* Main content */}
        <main>
          <article>
            {/* Hero section */}
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-12 lg:px-8">
              {/* Back button */}
              <Link
                href="/projects"
                prefetch={true}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-all duration-200 hover:gap-3"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to projects</span>
              </Link>
              {/* Title */}
              <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>

              {/* Description */}
              {description && (
                <p className="text-muted-foreground text-lg leading-relaxed sm:text-xl">
                  {description}
                </p>
              )}

              {/* Metadata */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time>{formattedDate}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
                {author && (
                  <div className="flex items-center gap-2">
                    <span>by</span>
                    <span className="text-foreground font-medium">{author}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Wide hero image */}
            {image && (
              <div className="relative mx-auto mb-8 aspect-video w-full max-w-7xl overflow-hidden rounded-lg px-4 sm:mb-16 sm:px-6 lg:px-8">
                <Image src={image} alt={title} fill className="object-contain" priority />
              </div>
            )}

            {/* Article content */}
            <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
              {/* Markdown content rendered with ReactMarkdown */}
              <div className="prose prose-base sm:prose-lg prose-neutral dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl sm:prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-xl sm:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:border-b prose-h2:pb-2 prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4 prose-p:text-sm sm:prose-p:text-base prose-p:leading-7 sm:prose-p:leading-8 prose-p:mb-4 sm:prose-p:mb-6 prose-li:text-sm sm:prose-li:text-base prose-li:leading-6 sm:prose-li:leading-7 prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg prose-strong:font-bold prose-strong:text-foreground prose-em:italic prose-code:text-xs sm:prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 sm:prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="mb-4 text-4xl font-bold">{children}</h1>,
                    h2: ({ children }) => {
                      const id = String(children)
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <h2 id={id} className="mt-12 mb-6 border-b pb-2 text-3xl font-bold">
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
                        <h3 id={id} className="mt-8 mb-4 text-2xl font-bold">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => <p className="mb-6 text-base leading-8">{children}</p>,
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "";
                      const isInline = !className;

                      if (isInline) {
                        return (
                          <code className="bg-muted rounded px-2 py-1 text-sm" {...props}>
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
                      <blockquote className="relative my-8 rounded-r-lg border-l-4 border-blue-500 bg-[#1a2332] py-6 pr-6 pl-6 not-italic">
                        <div className="flex gap-3">
                          <div className="mt-1 flex-shrink-0">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                              <Info className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 text-base leading-7 text-gray-300">{children}</div>
                        </div>
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-6 ml-6 list-outside list-disc space-y-3">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-6 ml-6 list-outside list-decimal space-y-3">{children}</ol>
                    ),
                    li: ({ children }) => <li className="pl-2 text-base leading-7">{children}</li>,
                    a: ({ href, children }) => {
                      // Check if it's a YouTube link
                      if (
                        href &&
                        (href.includes("youtube.com/watch") || href.includes("youtu.be/"))
                      ) {
                        let videoId = "";

                        if (href.includes("youtube.com/watch")) {
                          const url = new URL(href);
                          videoId = url.searchParams.get("v") || "";
                        } else if (href.includes("youtu.be/")) {
                          videoId = href.split("youtu.be/")[1]?.split("?")[0] || "";
                        }

                        if (videoId) {
                          return (
                            <div className="my-6 aspect-video w-full">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="h-full w-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube video"
                              />
                            </div>
                          );
                        }
                      }

                      return (
                        <a
                          href={href}
                          className="text-primary font-medium no-underline hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      );
                    },
                    img: ({ src, alt }) => {
                      if (typeof src !== "string") return null;
                      return (
                        <Image
                          src={src}
                          alt={alt || ""}
                          width={800}
                          height={400}
                          className="my-6 rounded-lg shadow-lg"
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
                <ShareButtons label="Share this Project" title={title} slug={slug} />
              </div>

              {/* Footer section with tags */}
              {tags && tags.length > 0 && (
                <div className="mt-12 border-t pt-8">
                  <h3 className="text-muted-foreground mb-4 text-sm font-semibold">Tagged with</h3>
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

          {/* AI Chat Button - Fixed bottom right */}
          <AIChatButton blogContent={data.rawContent} blogTitle={title} />
        </main>
      </div>
    </ScrollArea>
  );
}
