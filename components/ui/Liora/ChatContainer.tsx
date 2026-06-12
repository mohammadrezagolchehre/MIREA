'use client';

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";
import { Message } from "../../../app/types/message";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputOnly?: boolean;
};

export default function ChatContainer({ messages, setMessages, inputOnly }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      // خوندن stream
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
              // آپدیت real-time
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiId ? { ...m, content: fullContent, status: "streaming" } : m
                )
              );
            }
          } catch {
            // خط ناقص، skip میکنیم
          }
        }
      }

      // وضعیت نهایی
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: fullContent, status: "completed" } : m
        )
      );

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
    <div className="flex flex-col h-full">
      <div className={`flex-1 overflow-y-auto px-4 pt-20 ${messages.length ? "pb-32" : "pb-4"}`}>
        <MessageList messages={messages} onEdit={handleEdit} />
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full p-4 shrink-0">
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