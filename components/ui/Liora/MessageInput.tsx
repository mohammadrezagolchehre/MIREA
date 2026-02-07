'use client';

import { useState } from "react";
import { Send } from "lucide-react";

type MessageInputProps = {
  onSend: (text: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);   // پیام به بیرون ارسال میشه
    setMessage("");    // خالی کردن input بعد از ارسال
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/60 backdrop-blur-xl border border-pink/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-300 to-sky-300 text-white transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send size={18} />
        </button>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          dir="rtl"
          placeholder="سلام، چطور میتونم کمکت کنم؟"
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none text-right"
        />
      </div>
    </div>
  );
}
