'use client';

import OptionChips from "./OptionChips";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function ChatContainer({ messages, setMessages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false);

  const [isStreaming, setIsStreaming] = useState(false);

  // 🔽 اسکرول به آخر
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStop = () => {
    stopRef.current = true;
    setIsStreaming(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    stopRef.current = false;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages(prev => [...prev, userMessage]);

    const aiId = crypto.randomUUID();

    setMessages(prev => [
      ...prev,
      { id: aiId, role: "ai", text: "" },
    ]);

    setIsStreaming(true);

    const fullText =
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.";

    const words = fullText.split(" ");
    let current = "";

    for (let i = 0; i < words.length; i++) {
      if (stopRef.current) break;

      await new Promise(res => setTimeout(res, 140)); // سرعت نرم‌تر

      current += (i === 0 ? "" : " ") + words[i];

      setMessages(prev =>
        prev.map(m =>
          m.id === aiId ? { ...m, text: current } : m
        )
      );
    }

    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-full">

      {/* لیست پیام‌ها */}
      <div
        className={`flex-1 overflow-y-auto px-4 ${
          messages.length ? "pb-32" : "pb-4"
        }`}
      >
        <MessageList messages={messages} />
        <div ref={bottomRef} />
      </div>

      {/* اینپوت */}
      <div className="sticky bottom-0 left-0 w-full p-4 shrink-0">
        {messages.length === 0 && (
          <div className="mb-4">
            <OptionChips onSelect={handleSend} />
          </div>
        )}

        <MessageInput
          onSend={handleSend}
          isStreaming={isStreaming}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}