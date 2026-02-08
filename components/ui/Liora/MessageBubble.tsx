'use client';

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[70%] p-3 rounded-2xl break-words whitespace-pre-wrap
      ${
        isUser
          ? "self-end bg-linear-to-br from-pink-300 to-sky-300 text-white"
          : "self-start bg-white/60 backdrop-blur-md text-foreground"
      }`}
    >
      {message.text}
    </div>
  );
}
