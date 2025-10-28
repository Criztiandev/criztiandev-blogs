"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatButtonProps {
  blogContent: string;
  blogTitle?: string;
}

export default function AIChatButton({ blogContent, blogTitle }: AIChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch remaining messages from server
  const { data: rateLimitData, refetch: refetchRateLimit } = trpc.rateLimit.check.useQuery(
    undefined,
    {
      enabled: isOpen, // Only fetch when chat is open
      refetchOnWindowFocus: false,
    }
  );

  const remainingDaily = rateLimitData?.remainingDaily ?? 15;
  const remainingMinute = rateLimitData?.remainingMinute ?? 3;

  // Record message mutation
  const recordMessageMutation = trpc.rateLimit.record.useMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    // Check rate limits before sending (server-side)
    if (!rateLimitData?.allowed) {
      toast.error(rateLimitData?.reason || "Rate limit exceeded");
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          blogContent,
          blogTitle,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      // Create a new message for streaming content
      const assistantMessageIndex = messages.length + 1;
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        // Update the assistant message with accumulated content
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[assistantMessageIndex] = {
            role: "assistant",
            content: accumulatedContent,
          };
          return newMessages;
        });
      }

      // Record successful message send
      await recordMessageMutation.mutateAsync();

      // Refetch rate limit to update remaining count
      refetchRateLimit();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted");
        return;
      }

      console.error("Error streaming AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        },
      ]);
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <>
      {/* Floating Button - Responsive sizing */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="fixed right-6 bottom-6 z-40 h-12 w-12 rounded-full p-0 shadow-lg transition-transform hover:scale-110 sm:right-8 sm:bottom-8 sm:h-14 sm:w-14"
      >
        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Side Sheet - Responsive width */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-background border-border fixed top-0 right-0 bottom-0 z-50 flex w-full flex-col border-l shadow-2xl md:w-[400px] lg:w-[480px]"
          >
            {/* Header */}
            <div className="border-border flex shrink-0 flex-col gap-2 border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary h-5 w-5" />
                  <h2 className="text-lg font-semibold">Polar AI</h2>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearChat} className="h-8 text-xs">
                      <X className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Message Counter */}
              <div className="flex flex-col items-start gap-3 text-xs">
                {blogTitle && (
                  <div className="flex gap-1">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground truncate">{blogTitle}</span>
                  </div>
                )}

                <span
                  className={cn(
                    "rounded-md px-2 py-1 font-medium",
                    remainingDaily <= 5
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {remainingDaily}/15 messages today
                </span>
              </div>
            </div>

            {/* Messages - Using ScrollArea */}
            <ScrollArea className="flex-1">
              <div className="h-full min-h-0 px-6 py-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                    <Sparkles className="text-muted-foreground/20 mb-4 h-12 w-12" />
                    <p className="text-foreground text-base font-medium">No messages yet</p>
                    <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                      Ask me to summarize this blog, explain concepts, or answer questions about the
                      content.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 pb-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "flex w-full",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-foreground"
                          )}
                        >
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm prose-neutral dark:prose-invert prose-p:my-6 prose-p:leading-relaxed prose-headings:my-4 prose-headings:font-semibold prose-ul:my-4 prose-ol:my-4 prose-li:my-1.5 prose-code:text-xs prose-code:bg-background/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:my-4 prose-pre:bg-background prose-pre:text-xs prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {isStreaming && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted/50 flex items-center gap-2 rounded-2xl px-4 py-3">
                          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                          <span className="text-muted-foreground text-sm">Thinking...</span>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="bg-background shrink-0 border-t px-6 py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isStreaming}
                  className="flex-1 focus-visible:ring-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isStreaming}
                  size="icon"
                  className="shrink-0"
                >
                  {isStreaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
