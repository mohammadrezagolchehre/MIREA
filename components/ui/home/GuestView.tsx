'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import BlurText from "@/components/ui/Welcome";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import Grainient from "@/components/Grainient"; 
import { CurrentWeatherWidget } from "@/components/weather-widget";
import { StatsGrid } from "@/components/stats-widget";
import { Users } from "lucide-react";
import GradientText from "@/components/ui/GradiantText";

import { StockTickerWidget } from "@/components/stock-widget";




export default function Home() {
  type Message = {
    id: string;
    role: "user" | "ai";
    text: string;
  };

  const isLoggedIn = false; 
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const hasData = messages.length > 0;

  return (
    <div className="relative min-h-screen isolate">

      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none" />


      <main className="relative h-[100dvh] flex flex-col overflow-hidden px-4">
        <header className="absolute top-6 right-6 z-20 flex gap-3 jus">
          <GlassButton className=" " variant="subscription"
          onClick={()=> router.push("./pricing")}>
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
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
        {messages.length === 0 && (
          <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-10 py-10">
            <div className="text-center space-y-3">
            <div className="text-3xl md:text-5xl font-bold text-white">
             سلام من{" "}
              <GradientText
                text="لیورا"
              />
              هستم
            </div>

            <div className="text-lg md:text-2xl text-white/80">
              دستیار عواطف و احساسات شما 
            </div>
            </div>
          </section>
          
          
        )}
    </div>