"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "motion/react";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "What's your latest blog post about?",
  "What projects use React and TypeScript?",
  "Tell me about your professional background",
  "What's your tech stack?",
];

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC mutation for portfolio chat
  const portfolioChatMutation = trpc.ai.portfolioChat.useMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend || portfolioChatMutation.isPending) return;

    const userMessage: Message = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await portfolioChatMutation.mutateAsync({
        messages: [...messages, userMessage],
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response.content }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 pb-32 md:pb-36">
      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-border bg-card w-full max-w-3xl overflow-hidden rounded-lg border shadow-xl"
      >
        {/* Card Header */}
        <div className="border-border flex items-center gap-2 border-b px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-muted-foreground font-mono text-sm">Polar</span>
        </div>

        {/* Card Content */}
        <ScrollArea className="h-[500px]">
          <div className="p-6">
            {/* Welcome Message - Always visible */}
            <div className="mb-6 space-y-2 font-mono text-sm">
              <div className="flex gap-2">
                <span className="text-primary">→</span>
                <span className="text-muted-foreground">portfolio assistant</span>
              </div>
              <div className="text-foreground ml-4">
                Hi, I&apos;m Polar, Criztian&apos;s AI assistant. Ask me about projects, blogs, or
                tech stack.
              </div>
            </div>

            {/* Suggested Prompts - Show only when no messages */}
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 space-y-2"
                >
                  <div className="flex gap-2 font-mono text-sm">
                    <span className="text-primary">→</span>
                    <span className="text-muted-foreground">try asking:</span>
                  </div>
                  <div className="ml-4 flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        disabled={portfolioChatMutation.isPending}
                        className="border-border bg-muted/50 hover:bg-muted rounded border px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 font-mono text-sm"
                >
                  {message.role === "user" ? (
                    <>
                      <div className="flex gap-2">
                        <span className="text-primary">→</span>
                        <span className="text-muted-foreground">you</span>
                      </div>
                      <div className="text-foreground ml-4 whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <span className="text-primary">→</span>
                        <span className="text-muted-foreground">assistant</span>
                      </div>
                      <div className="prose prose-sm prose-neutral dark:prose-invert prose-p:my-2 prose-p:leading-relaxed prose-headings:my-2 prose-headings:font-semibold prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-code:text-xs prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:my-2 prose-pre:bg-muted prose-pre:text-xs prose-a:text-primary prose-a:underline hover:prose-a:no-underline prose-strong:font-semibold ml-4 max-w-none font-mono">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}

              {/* Loading State */}
              {portfolioChatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 font-mono text-sm"
                >
                  <div className="flex gap-2">
                    <span className="text-primary">→</span>
                    <span className="text-muted-foreground">assistant</span>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <Loader2 className="text-primary h-3 w-3 animate-spin" />
                    <span className="text-muted-foreground text-xs">thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        {/* Card Footer - Input */}
        <div className="border-border bg-muted/30 border-t p-4">
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-primary">→</span>
            <Input
              ref={inputRef}
              placeholder="ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={portfolioChatMutation.isPending}
              className={cn(
                "flex-1 border-0 bg-transparent px-0 font-mono text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/50"
              )}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || portfolioChatMutation.isPending}
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0"
            >
              {portfolioChatMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 ml-5 font-mono text-xs">
            press enter to send • shift+enter for new line
          </p>
        </div>
      </motion.div>
    </div>
  );
}
