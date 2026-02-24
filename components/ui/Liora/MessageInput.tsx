'use client';

import { useState, useRef, useEffect } from "react";
import { CornerLeftUp } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassTextarea } from "@/components/glass-textarea";

type MessageInputProps = {
  onSend: (text: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasText = message.trim().length > 0;

  // 🔥 Auto resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;


    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [message]);

  const handleSend = () => {
    if (!hasText) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="relative w-full ">

      <GlassTextarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="اینجا برام بنویس..."
        autoFocus
        rows={1}
        className="
          pr-4
          pl-14
          py-4
          max-h-[140px]
        "
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <GlassButton
        variant={hasText ? "default" : "outline"}
        size="icon"
        onClick={handleSend}
        disabled={!hasText}
        className="absolute left-3 bottom-8 md:bottom-9.5 h-9 w-9"
      >
        <CornerLeftUp size={18} />
      </GlassButton>

    </div>
  );
}