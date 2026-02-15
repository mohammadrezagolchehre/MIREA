'use client';

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function ChatContainer({ messages, setMessages }: Props) {

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);

    // پاسخ AI (شبیه‌سازی)
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
    <div className="w-full max-w-4xl z-10 flex flex-col gap-4">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}
