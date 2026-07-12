'use client';

import { useState } from "react";
import GuestHeader from "./GuestHeader";
import GradientText from "@/components/ui/GradiantText";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import { Message } from "@/app/types/message";
export default function GuestView() {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="relative min-h-screen isolate">
      <main className="relative h-dvh flex flex-col px-4">

        <GuestHeader/>

        {/* Hero — فقط قبل از اولین پیام */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                سلام، من{" "}
                <GradientText text="میرآ" />
                {" "}هستم
              </h1>
              <p className="text-lg md:text-xl text-white/60">
                دستیار عواطف و احساسات شما
              </p>
            </div>
          </div>
        )}

        {/* Chat */}
        <section className={messages.length === 0 ? "pb-4" : "flex-1 flex flex-col pb-4"}>
          <div className="mx-auto h-full w-full max-w-3xl">
            <ChatContainer
              messages={messages}
              setMessages={setMessages}
              inputOnly={messages.length === 0}
            />
          </div>
        </section>

      </main>
    </div>
  );
}
