'use client';

import { Copy, Pencil } from "lucide-react";
import { Message } from "../../../app/types/message";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div
      dir="rtl"
      className={`
        group relative
        max-w-[90%]
        rounded-2xl
        backdrop-blur-2xl
        transition-all
        ${
          isUser
            ? "self-end bg-white/15 border border-white/25 text-white"
            : "self-start bg-white/8 border border-white/15 text-white/85"
        }
      `}
    >
      
      <div className="px-4 py-3 break-words whitespace-pre-wrap">
        {message.content}
      </div>

      
      <div dir="rtl" className="px-3 pb-2">
        <div className="hidden md:flex gap-3 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleCopy}
            className="text-white/50 hover:text-white transition"
          >
            <Copy size={16} />
          </button>

          {isUser && (
            <button className="text-white/50 hover:text-white transition">
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}