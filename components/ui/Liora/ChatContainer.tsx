'use client';

import OptionChips from "./OptionChips";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../../app/types/message";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputOnly?: boolean;
};

export default function ChatContainer({
  messages,
  setMessages,
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false);

  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  
  const handleStop = () => {
    stopRef.current = true;
    setIsStreaming(false);
  };
  

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    
    stopRef.current = false;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    setMessages((prev) => [...prev, userMessage]);

    const aiId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: aiId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        status: "streaming",
      },
    ]);

    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error("API Error");
      }

      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                content: data.response,
                status: "completed",
              }
            : m
        )
      );
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? {
                ...m,
                content: "خطا در دریافت پاسخ",
                status: "error",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
    
  };

  
  return (
    <div className="flex flex-col h-full">
      <div
        className={`flex-1 overflow-y-auto px-4 pt-24 ${
          messages.length ? "pb-32" : "pb-4"
        }`}
      >
        <MessageList
          messages={messages}
        />

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full p-4 shrink-0">


        <MessageInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}