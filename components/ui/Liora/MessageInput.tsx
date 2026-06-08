'use client';

import { useState, useRef, useEffect } from "react";
import { CornerLeftUp, Square } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
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
      setMessage(defaultValue);
      onDefaultValueUsed?.();
      setTimeout(() => {
        textareaRef.current?.focus();
        const len = defaultValue.length;
        textareaRef.current?.setSelectionRange(len, len);
      }, 50);
    }
  }, [defaultValue]);

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
        className="pr-4 pl-14 py-4 max-h-[140px]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <GlassButton
        variant={isStreaming ? "outline" : hasText ? "default" : "outline"}
        size="icon"
        onClick={() => {
          if (isStreaming) onStop();
          else handleSend();
        }}
        disabled={!hasText && !isStreaming}
        className="absolute left-3 bottom-8 md:bottom-9.5 h-9 w-9"
      >
        {isStreaming ? <Square size={16} /> : <CornerLeftUp size={18} />}
      </GlassButton>
    </div>
  );
}