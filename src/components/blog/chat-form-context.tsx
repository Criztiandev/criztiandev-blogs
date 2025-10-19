"use client";

import { createContext, useContext, ReactNode } from "react";
import { useForm, FormProvider as RHFFormProvider, UseFormReturn } from "react-hook-form";

interface ChatFormData {
  message: string;
}

interface ChatFormContextValue {
  methods: UseFormReturn<ChatFormData>;
  onExplainText: (text: string) => void;
}

const ChatFormContext = createContext<ChatFormContextValue | null>(null);

export function useChatForm() {
  const context = useContext(ChatFormContext);
  if (!context) {
    throw new Error("useChatForm must be used within ChatFormProvider");
  }
  return context;
}

interface ChatFormProviderProps {
  children: ReactNode;
  onExplainText: (text: string) => void;
}

export function ChatFormProvider({ children, onExplainText }: ChatFormProviderProps) {
  const methods = useForm<ChatFormData>({
    defaultValues: {
      message: "",
    },
  });

  return (
    <ChatFormContext.Provider value={{ methods, onExplainText }}>
      <RHFFormProvider {...methods}>
        {children}
      </RHFFormProvider>
    </ChatFormContext.Provider>
  );
}
