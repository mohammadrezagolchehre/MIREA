'use client';

import { memo, useCallback, useEffect, useRef } from "react";
import { CornerLeftUp, Square } from "lucide-react";
import { GlassTextarea } from "@/components/glass-textarea";

type MessageInputProps = {
  onSend: (text: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  defaultValue?: string;
  onDefaultValueUsed?: () => void;
};

function MessageInput({
  onSend,
  isStreaming,
  onStop,
  defaultValue,
  onDefaultValueUsed,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const prevDefaultValue = useRef<string>("");
  const onDefaultValueUsedRef = useRef(onDefaultValueUsed);

  useEffect(() => {
    onDefaultValueUsedRef.current = onDefaultValueUsed;
  }, [onDefaultValueUsed]);

  const syncInputState = useCallback(() => {
    const textarea = textareaRef.current;
    const button = buttonRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;

    const hasText = textarea.value.trim().length > 0;
    if (button) {
      const state = isStreaming ? "streaming" : hasText ? "ready" : "idle";
      button.dataset.state = state;
      button.setAttribute("aria-disabled", String(state === "idle"));
    }
  }, [isStreaming]);

  useEffect(() => {
    if (!defaultValue) {
      prevDefaultValue.current = "";
      return;
    }

    if (defaultValue === prevDefaultValue.current) return;
    prevDefaultValue.current = defaultValue;

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.value = defaultValue;
    syncInputState();
    textarea.focus();
    textarea.setSelectionRange(defaultValue.length, defaultValue.length);
    onDefaultValueUsedRef.current?.();
  }, [defaultValue, syncInputState]);

  useEffect(() => {
    syncInputState();
  }, [syncInputState]);

  const handleSend = () => {
    const textarea = textareaRef.current;
    if (!textarea || isStreaming) return;

    const text = textarea.value.trim();
    if (!text) return;

    textarea.value = "";
    syncInputState();
    onSend(text);
  };

  return (
    <div className="relative w-full">
      <GlassTextarea
        ref={textareaRef}
        defaultValue=""
        onInput={syncInputState}
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
        ref={buttonRef}
        type="button"
        aria-label={isStreaming ? "توقف پاسخ" : "ارسال پیام"}
        title={isStreaming ? "توقف پاسخ" : "ارسال پیام"}
        onClick={() => {
          if (isStreaming) onStop();
          else handleSend();
        }}
        aria-disabled={!isStreaming}
        data-state={isStreaming ? "streaming" : "idle"}
        className={`
          absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl
          border border-white/15 bg-white/[0.08] text-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.16)]
          backdrop-blur-xl transition-all duration-200
          hover:border-white/25 hover:bg-white/[0.12] hover:text-white/90
          data-[state=idle]:pointer-events-none data-[state=idle]:opacity-45
          data-[state=ready]:border-cyan-200/25 data-[state=ready]:bg-white/10 data-[state=ready]:text-cyan-100/90
        `}
      >
        {isStreaming ? <Square size={16} /> : <CornerLeftUp size={18} />}
      </button>
    </div>
  );
}

export default memo(MessageInput);
