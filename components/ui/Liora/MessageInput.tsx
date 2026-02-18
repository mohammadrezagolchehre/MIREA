'use client';

import { useState } from "react";
import { LucideArrowBigUp } from "lucide-react";
import { GlassTextarea } from "@/components/glass-textarea";
import { GlassButton } from "@/components/ui/glass-button";

type MessageInputProps = {
  onSend: (text: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const hasText = message.trim().length > 0;

  const handleSend = () => {
    if (!hasText) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">

      <GlassTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        placeholder="اینجا برامون بنویس"
        autoFocus
        className="pr-14"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <GlassButton
        variant={hasText ? "primary" : "default"}
        size="icon"
        onClick={handleSend}
        disabled={!hasText}
        className="absolute left-3 bottom-6 transition-all"
      >
        <LucideArrowBigUp size={18} />
      </GlassButton>

    </div>
  );
}
