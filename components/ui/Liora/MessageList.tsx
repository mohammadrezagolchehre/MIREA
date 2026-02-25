'use client';
import MessageBubble from "./MessageBubble";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
}