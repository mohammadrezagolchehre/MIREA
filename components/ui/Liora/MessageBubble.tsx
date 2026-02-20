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
      dir="rtl"
      className={`
        max-w-[70%] px-4 py-3
        rounded-2xl
        break-words whitespace-pre-wrap
        transition-all duration-300
        backdrop-blur-2xl
        ${
          isUser
            ? `
              self-end
              bg-white/15
              border border-white/25
              text-white
              shadow-[0_10px_30px_rgba(140,134,255,0)]
            `
            : `
              self-start
              bg-white/8
              border border-white/15
              text-white/85
              shadow-[0_8px_25px_rgba(0,0,0,0.2)]
            `
        }
      `}
    >
      {message.text}
    </div>
  );
}