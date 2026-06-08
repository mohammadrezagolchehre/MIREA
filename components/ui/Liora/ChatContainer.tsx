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
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStop = () => {
    stopRef.current = true;
    setIsStreaming(false);
  };

  const handleEdit = (id: string, content: string) => {
  setEditingId(id);
  setEditValue(content);
  // پیام کاربر و همه چیز بعدش رو حذف کن
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
      // history رو میفرستیم تا میرآ مکالمه رو یادش بمونه
      const history = updatedMessages
        .filter((m) => m.status === "completed")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: data.response, status: "completed" } : m
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