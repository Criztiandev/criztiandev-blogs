"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useFormContext } from "react-hook-form";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  blogTitle?: string;
  blogContent?: string;
}

export default function ChatBot({
  isOpen,
  onClose,
  initialMessage,
  blogTitle,
  blogContent,
}: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext<{ message: string }>();

  const chatMutation = trpc.ai.chat.useMutation();

  const processedMessageRef = useRef<string | null>(null);

  // Watch the form input value
  const input = watch("message");

  useEffect(() => {
    if (initialMessage && isOpen && initialMessage !== processedMessageRef.current) {
      console.log("Processing initial message:", initialMessage);
      processedMessageRef.current = initialMessage;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: initialMessage,
      };

      setMessages([userMessage]);
      setIsLoading(true);

      // Send to AI
      chatMutation.mutateAsync({
        messages: [{ role: "user", content: initialMessage }],
        blogTitle: blogTitle || "",
        blogContent: blogContent || "",
      }).then((response) => {
        console.log("AI Response:", response);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }).catch((error) => {
        console.error("Error generating response:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }).finally(() => {
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.message) {
        setValue("message", customEvent.detail.message);
      }
    };

    window.addEventListener("openChat", handleOpenChat);
    return () => window.removeEventListener("openChat", handleOpenChat);
  }, [setValue]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setValue("message", "");
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the API
      const messageHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatMutation.mutateAsync({
        messages: messageHistory,
        blogTitle: blogTitle || "",
        blogContent: blogContent || "",
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Right Side Sheet */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-secondary">
          <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-muted-foreground">
              Ask me anything about the blog or select text to explain it!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-foreground border border-border"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-foreground px-4 py-2 rounded-lg border border-border">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

        {/* Input */}
        <div className="border-t border-border p-6 bg-secondary">
          <div className="flex gap-3">
            <input
              type="text"
              value={input || ""}
              onChange={(e) => setValue("message", e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              placeholder="Ask something..."
              className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input?.trim()}
              className="p-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
