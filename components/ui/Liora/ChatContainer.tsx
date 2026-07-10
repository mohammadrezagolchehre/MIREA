'use client';

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../../app/types/message";
import { useEmotion } from "../../context/EmotionContext";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputOnly?: boolean;
  pendingMessage?: string;
  onPendingMessageSent?: () => void;
};

export default function ChatContainer({ messages, setMessages, inputOnly, pendingMessage, onPendingMessageSent }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const { detectEmotion } = useEmotion();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (pendingMessage) {
      handleSend(pendingMessage);
      onPendingMessageSent?.();
    }
  }, [pendingMessage]);

  const handleStop = () => {
    stopRef.current = true;
    setIsStreaming(false);
  };

  const handleEdit = (id: string, content: string) => {
    setEditValue(content);
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === id);
      return prev.slice(0, index);
    });
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const aiId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: "assistant", content: "", createdAt: new Date().toISOString(), status: "streaming" },
    ]);

    setIsStreaming(true);

    try {
      const history = updatedMessages
        .filter((m) => m.status === "completed")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok || !response.body) throw new Error("API Error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        if (stopRef.current) break;
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const json = line.replace("data: ", "").trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              fullContent += delta;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiId ? { ...m, content: fullContent, status: "streaming" } : m
                )
              );
            }
          } catch { }
        }
      }

      // پیام کامل شد — آپدیت state و تشخیص احساس
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: fullContent, status: "completed" } : m
        )
      );

      // 👇 تشخیص احساس بعد از تموم شدن پیام
      const allMessages = [
        ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "assistant", content: fullContent },
      ];
      detectEmotion(allMessages);

    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: "خطا در دریافت پاسخ", status: "error" } : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  if (inputOnly) {
    return (
      <MessageInput onSend={handleSend} isStreaming={isStreaming} onStop={handleStop} />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className={`flex-1 min-h-0 overflow-y-auto px-1 sm:px-4 pt-4 sm:pt-8 md:pt-20 [&::-webkit-scrollbar]:hidden ${messages.length ? "pb-28 sm:pb-32" : "pb-4"}`}>
        <MessageList messages={messages} onEdit={handleEdit} />
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full px-0 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4 shrink-0">
        <MessageInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
          defaultValue={editValue}
          onDefaultValueUsed={() => setEditValue("")}
        />
      </div>
    </div>
  );
}
