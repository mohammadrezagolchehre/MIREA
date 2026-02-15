'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

import { GlassButton } from "@/components/ui/glass-button";
import BlurText from "@/components/ui/Welcome";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import Grainient from "@/components/Grainient";  // فرض می‌کنیم در این مسیر است

export default function Home() {
  type Message = {
    id: string;
    role: "user" | "ai";
    text: string;
  };

  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="relative min-h-screen isolate">

    
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Grainient
          color1="DDAED3"      
          color2="F1E6C9"     
          color3="B0FFFA"      
          timeSpeed={0.15}    
          grainAmount={0.05}   
          warpStrength={0.8}  
          zoom={1.0}
          className="w-full h-full"
        />
      </div>

      <main className="relative min-h-screen flex flex-col justify-center items-center px-4">
        <header className="absolute top-6 right-6 z-20 flex gap-3">
          <GlassButton
            variant="default"
            onClick={() => router.push("./auth/login")}
          >
            ورود
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={() => router.push("./auth/signup")}
          >
            ثبت نام
          </GlassButton>
        </header>

        {messages.length === 0 && (
          <section className="flex-1 flex items-center justify-center text-center transition-all duration-500 z-10">
            <BlurText
              text="آمدید خوش لیورا به"
              animateBy="words"
              direction="top"
              className="text-4xl md:text-6xl font-bold text-black drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              delay={150}
            />
          </section>
        )}

        <section className="w-full flex justify-center pb-16 z-10">
          <div className="w-full max-w-xl">
            <ChatContainer messages={messages} setMessages={setMessages} />
          </div>
        </section>
      </main>
    </div>
  );
}