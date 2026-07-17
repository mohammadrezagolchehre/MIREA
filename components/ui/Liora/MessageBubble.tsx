'use client';

import { Copy, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { Message } from "../../../app/types/message";

type Props = {
  message: Message;
  onEdit?: (id: string, content: string) => void;
};

function TypingDots() {
  return (
    <div className="flex h-6 items-center gap-1 px-1 py-1" aria-label="میرآ در حال نوشتن است">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="h-2 w-1 rounded-full bg-cyan-200/60"
          style={{
            animation: "typing-wave 1.05s ease-in-out infinite",
            animationDelay: `${i * 95}ms`,
          }}
        />
      ))}
    </div>
  );
}

function formatMessageTime(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function MessageBubble({ message, onEdit }: Props) {
  const isUser = message.role === "user";
  const isLoading = message.status === "streaming" && !message.content;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const time = formatMessageTime(message.createdAt);

  return (
    <motion.div
      dir="rtl"
      initial={{ y: 14, opacity: 0, scale: 0.99 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`
        group relative w-fit max-w-[92%] rounded-2xl backdrop-blur-2xl transition-all duration-300 sm:max-w-[90%]
        ${isUser
          ? "ml-auto bg-white/15 border border-white/25 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          : "mr-auto bg-white/8 border border-cyan-300/20 text-white/85 shadow-[inset_1px_0_0_rgba(103,232,249,0.22),0_10px_30px_rgba(0,0,0,0.12)]"
        }
      `}
    >
      <div className="break-words whitespace-pre-wrap px-3 py-2.5 text-sm leading-7 sm:px-4 sm:py-3 sm:text-base">
        {isLoading ? <TypingDots /> : message.content}
      </div>

      {!isLoading && (
        <div className="flex items-center justify-between gap-3 px-3 pb-2">
          <span className="text-[10px] leading-none text-white/30">{time}</span>
          <div className="flex justify-end gap-1 opacity-100 transition-opacity duration-200 md:opacity-0 group-hover:opacity-100">
            <button
              aria-label="کپی پیام"
              onClick={handleCopy}
              className="rounded-lg p-1 text-white/45 transition hover:bg-white/10 hover:text-white/80"
            >
              <Copy size={16} />
            </button>
            {isUser && onEdit && (
              <button
                aria-label="ویرایش پیام"
                onClick={() => onEdit(message.id, message.content)}
                className="rounded-lg p-1 text-white/45 transition hover:bg-white/10 hover:text-white/80"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
