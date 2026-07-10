'use client';

import { useState, useRef, useEffect } from "react";
import { CornerLeftUp, Square } from "lucide-react";
import { GlassTextarea } from "@/components/glass-textarea";

type MessageInputProps = {
  onSend: (text: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  defaultValue?: string;
  onDefaultValueUsed?: () => void;
};

export default function MessageInput({
  onSend,
  isStreaming,
  onStop,
  defaultValue,
  onDefaultValueUsed,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasText = message.trim().length > 0;
  const prevDefaultValue = useRef<string>("");

  useEffect(() => {
    if (defaultValue && defaultValue !== prevDefaultValue.current) {
      prevDefaultValue.current = defaultValue;
      const timer = window.setTimeout(() => {
        setMessage(defaultValue);
        onDefaultValueUsed?.();
        textareaRef.current?.focus();
        const len = defaultValue.length;
        textareaRef.current?.setSelectionRange(len, len);
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [defaultValue, onDefaultValueUsed]);

  // Auto resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [message]);

  const handleSend = () => {
    if (!hasText || isStreaming) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="relative w-full">
      <GlassTextarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="اینجا برام بنویس..."
        autoFocus
        rows={1}
        disabled={isStreaming}
        className="pr-4 pl-14 py-3 sm:py-4 max-h-[140px] text-[16px] sm:text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        type="button"
        onClick={() => {
          if (isStreaming) onStop();
          else handleSend();
        }}
        disabled={!hasText && !isStreaming}
        className={`
          absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl
          border border-white/15 bg-white/[0.08] text-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.16)]
          backdrop-blur-xl transition-all duration-200
          hover:border-white/25 hover:bg-white/[0.12] hover:text-white/90
          disabled:pointer-events-none disabled:opacity-45
          ${hasText && !isStreaming ? "border-cyan-200/25 bg-white/10 text-cyan-100/90" : ""}
        `}
      >
        {isStreaming ? <Square size={16} /> : <CornerLeftUp size={18} />}
      </button>
    </div>
  );
}
