'use client';

import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useCallback, useEffect, useRef, useState } from "react";
import { Message } from "../../../app/types/message";
import { useEmotion } from "../../context/EmotionContext";

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputOnly?: boolean;
  pendingMessage?: string;
  onPendingMessageSent?: () => void;
};

export default function ChatContainer({ messages, setMessages, inputOnly, pendingMessage, onPendingMessageSent }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  const isStreamingRef = useRef(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const { detectEmotion } = useEmotion();

  messagesRef.current = messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isStreaming ? "auto" : "smooth" });
  }, [messages, isStreaming]);

  const handleStop = useCallback(() => {
    stopRef.current = true;
    abortControllerRef.current?.abort();
    isStreamingRef.current = false;
    setIsStreaming(false);
  }, []);

  const handleEdit = useCallback((id: string, content: string) => {
    setEditValue(content);
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === id);
      return prev.slice(0, index);
    });
  }, [setMessages]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isStreamingRef.current) return;
    stopRef.current = false;
    isStreamingRef.current = true;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      status: "completed",
    };

    const updatedMessages = [...messagesRef.current, userMessage];
    setMessages(updatedMessages);

    const aiId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: "assistant", content: "", createdAt: new Date().toISOString(), status: "streaming" },
    ]);

    setIsStreaming(true);
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    let fullContent = "";
    let renderFrame: number | null = null;

    const renderStream = () => {
      renderFrame = null;
      const content = fullContent;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content, status: "streaming" } : m
        )
      );
    };

    try {
      const history = messagesRef.current
        .filter((m) => m.status === "completed")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { details?: string; error?: string }
          | null;
        throw new Error(payload?.details ?? payload?.error ?? "خطا در دریافت پاسخ");
      }

      if (!response.body) {
        throw new Error("پاسخی از سرویس هوش مصنوعی دریافت نشد.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (stopRef.current) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data: "));
          if (!line) continue;
          const json = line.replace("data: ", "").trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              fullContent += delta;
              if (renderFrame === null) {
                renderFrame = window.requestAnimationFrame(renderStream);
              }
            }
          } catch { }
        }
      }

      if (renderFrame !== null) {
        window.cancelAnimationFrame(renderFrame);
        renderFrame = null;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: fullContent, status: "completed" } : m
        )
      );

      const allMessages = [
        ...updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "assistant", content: fullContent },
      ];
      detectEmotion(allMessages);

    } catch (error) {
      if (renderFrame !== null) {
        window.cancelAnimationFrame(renderFrame);
      }

      if (stopRef.current || (error instanceof DOMException && error.name === "AbortError")) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId ? { ...m, content: fullContent, status: "completed" } : m
          )
        );
        return;
      }

      console.warn("Chat request failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "خطا در دریافت پاسخ";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId ? { ...m, content: errorMessage, status: "error" } : m
        )
      );
    } finally {
      abortControllerRef.current = null;
      isStreamingRef.current = false;
      setIsStreaming(false);
    }
  }, [detectEmotion, setMessages]);

  const handleDefaultValueUsed = useCallback(() => {
    setEditValue("");
  }, []);

  useEffect(() => {
    if (!pendingMessage) return;
    handleSend(pendingMessage);
    onPendingMessageSent?.();
  }, [handleSend, onPendingMessageSent, pendingMessage]);

  if (inputOnly) {
    return (
      <MessageInput
        onSend={handleSend}
        isStreaming={isStreaming}
        onStop={handleStop}
        defaultValue={editValue}
        onDefaultValueUsed={handleDefaultValueUsed}
      />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className={`flex-1 min-h-0 overflow-y-auto px-1 pt-4 sm:px-4 sm:pt-6 md:pt-8 [&::-webkit-scrollbar]:hidden ${messages.length ? "pb-28 sm:pb-32" : "pb-4"}`}>
        <MessageList messages={messages} onEdit={handleEdit} />
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full px-0 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4 shrink-0">
        <MessageInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
          defaultValue={editValue}
          onDefaultValueUsed={handleDefaultValueUsed}
        />
      </div>
    </div>
  );
}
