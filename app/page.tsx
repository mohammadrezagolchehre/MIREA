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
import { StockTickerWidget } from "@/components/stock-widget";


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

          

      <div className="fixed inset-0 -z-20 pointer-events-none">
        <Grainient
          color1="FF52A0"
          color2="E4D5FF"
          color3="1420A6"
          timeSpeed={0.15}
          grainAmount={0.02}
          warpStrength={0.8}
          zoom={1.0}
          className="w-full h-full"
        />
      </div>


      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none" />


      <main className="relative h-[100dvh] flex flex-col overflow-hidden px-4">
        <header className="absolute top-6 right-6 z-20 flex gap-3 jus">
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
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
        {messages.length === 0 && (
          <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-10 py-10">
            <div className="text-center space-y-3">
            <div className="text-3xl md:text-4xl font-bold text-white">
              Hello, I am{" "}
              <GradientText
                text="Liora"
              />
            </div>

            <div className="text-lg md:text-xl text-white/80">
              Your AI companion for your emotions.
            </div>
            </div>
          </section>
          
          
        )}
        </div>
        
{messages.length === 0 && (
    <section className="mt-15 w-full flex justify-center">
      <div className="w-full max-w-4xl mx-auto px-6 md: px-20">


        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full px-5 items-stretch"> {/* items-stretch برای کشیدن ارتفاع */}
          <div className="w-full scale-[0.85] sm:scale-100 origin-top min-h-[200px]"> {/* scale درست شد، min-h اضافه شد */}
            <StatsGrid 
              stats={[
                {
                  title: "شاخص خودآگاهی",
                  value: "74%",
                  change: { value: 3.1, type: "increase" },
                  glowColor: "pink",
                },
              ]}
            />  
          </div>
          <div className="w-full scale-[0.85] sm:scale-100 origin-top min-h-[200px]">
            <StockTickerWidget
              symbol="شاخص خودآگاهی"
              name="Emotional Growth Index"
              price={78.4}
              change={+2.3}
              changePercent={3.1}
              chartData={[62, 65, 68, 70, 72, 75, 78]}
            />
          </div>
          <div className="w-full scale-[0.85] sm:scale-100 origin-top min-h-[200px]" >
            <CurrentWeatherWidget
              temperature="آرام"
              location="وضعیت احساسی امروز"
              condition="s"
            />
          </div>
        </div>

    </div>
  </section>
)}




        <section className="flex-shrink-0 pb-4">
          <div className="max-w-3xl mx-auto w-full">
            <ChatContainer messages={messages} setMessages={setMessages} />
          </div>
        </section>


      </main>
    </div>
  );
}