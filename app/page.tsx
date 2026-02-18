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
import OptionChips from "@/components/ui/Liora/OptionChips";


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
          color1="FF4F9A"      
          color2="FDF9FF"     
          color3="2B3FFF"     
          timeSpeed={0.15}    
          grainAmount={0.05}   
          warpStrength={0.8}  
          zoom={1.0}
          className="w-full h-full trans"
        />
      </div>

      <main className="relative min-h-screen flex flex-col px-4">
        <header className="absolute top-6 right-6 z-20 flex gap-3">
          <GlassButton className=" " variant="destructive"
          onClick={()=> router.push("./pricing")}>
            خرید اشتراک
          </GlassButton>

          <GlassButton
            variant="default"
            onClick={() => router.push("./auth/login")}
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
        {messages.length === 0 && (
          <section className="flex flex-col items-center justify-center text-center z-10 gap-4 pt-32">
            <div className="text-4xl md:text-3xl font-bold text-white drop-shadow-lg">
              Hello, I am{" "}
              <GradientText
                text="Liora"
              />
            </div>

            <div className="text-2xl md:text-xl text-white/90 ">
              Your AI companion for your emotions.
            </div>
          </section>
          
          
        )}
        
          {messages.length === 0 && (
            <div dir="RTL" className="mt-16  w-full flex justify-center" >
              <div className="w-full max-w-4xl px-4">
                <StatsGrid
                  stats={[
                    {
                      title: "وضعیت احساسی امروز",
                      value: "آرام و متفکر",
                      change: { value: 6.4, type: "increase" },
                      glowColor: "purple",
                    },
                    {
                      title: "گفتگوهای عمیق این هفته",
                      value: "18 مکالمه",
                      change: { value: 12.2, type: "increase" },
                      glowColor: "blue",
                    },
                    {
                      title: "شاخص خودآگاهی",
                      value: "74%",
                      change: { value: 3.1, type: "increase" },
                      glowColor: "pink",
                    },
                  ]}
                />
              </div>
            </div>
          )}



        <section className="w-full flex justify-center mt-auto mb-8 z-10">
          <div className="w-full max-w-3xl max-h-xl ">
            <ChatContainer messages={messages} setMessages={setMessages} />
          </div>
        </section>


      </main>
    </div>
  );
}