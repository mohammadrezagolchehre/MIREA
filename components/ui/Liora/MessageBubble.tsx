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
      className={`
        max-w-[70%] px-4 py-3
        rounded-2xl
        break-words whitespace-pre-wrap
        transition-all duration-300
        ${
          isUser
            ? `
              self-end
              bg-gradient-to-br from-[#8C86FF] to-[#6CA7FF]
              text-white
              shadow-[0_10px_20px_rgba(124,140,255,0.25)]
            `
            : `
              self-start
              bg-white/10
              backdrop-blur-2xl
              border border-white/15
              text-white/90
              shadow-[0_8px_20px_rgba(0,0,0,0.1)]
            `
        }
      `}
    >
      {message.text}
    </div>
  );
}