'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import GradientText from "@/components/ui/GradiantText";

export default function Home() {
  type Message = {
    id: string;
    role: "user" | "ai";
    text: string;
  };

  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="relative min-h-screen overflow-hidden isolate bg-black">

      {/* overlay */}
      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none" />

      <main className="relative min-h-[100dvh] flex flex-col overflow-hidden px-4">

        {/* Header */}
        <header className="absolute top-6 right-6 z-20 flex gap-3">
          <GlassButton
            variant="subscription"
            onClick={() => router.push("./pricing")}
          >
            خرید اشتراک
          </GlassButton>

          <GlassButton
            variant="default"
            onClick={() => router.push("./auth/login")}
            className="text-white"
          >
            ورود
          </GlassButton>

          <GlassButton
            variant="primary"
            onClick={() => router.push("./auth/signup")}
            glowEffect
          >
            ثبت نام
          </GlassButton>
        </header>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">

          {messages.length === 0 && (
            <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 text-center px-4">

              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white">
                  سلام من{" "}
                  <GradientText text="لیورا" /> هستم
                </h1>

                <p className="text-lg md:text-2xl text-white/80">
                  دستیار عواطف و احساسات شما
                </p>
              </div>

            </section>
          )}

        </div>

        {/* Chat Box bottom */}
        <section className="flex-shrink-0 pb-4">
          <div className="max-w-3xl mx-auto w-full">
            <ChatContainer messages={messages} setMessages={setMessages} />
          </div>
        </section>

      </main>
    </div>
  );
}