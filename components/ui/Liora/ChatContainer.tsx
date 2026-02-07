'use client';

import { useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    // پاسخ AI (شبیه‌سازی شده)
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: "این پاسخ شبیه‌سازی AI است.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <div className="w-full max-w-xl z-10 flex flex-col gap-2">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
