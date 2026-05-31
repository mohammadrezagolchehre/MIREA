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
import { GlassSeparator } from "@/components/glass-separator";
import { StockTickerWidget } from "@/components/stock-widget";
import {Message} from "../app/types/message";

export default function Home(){

  const isLoggedIn = false; 
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const hasData = true;

  return (
    <div className="relative min-h-screen isolate">

      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none" />


     <main className="relative h-dvh flex flex-col px-4">
        <header className="absolute top-6 right-6 z-20 flex gap-3 ">
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
          <section className="w-full max-w-5xl mx-auto flex flex-col items-center gap-10 pr-5 py-10">
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
    {messages.length === 0 &&(
    <div dir="rtl" className="max-w-2xl mx-auto w-full text-white/80 mb-4 px-4">

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">شروع همراهی با لیورا</h3>
        <p className="text-white/50 text-sm">
          اینجا جاییه که میتونی بدون نگرانی حرف بزنی.
        </p>
      </div>

      <GlassSeparator className="my-6" />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">آماده‌ای شروع کنیم؟</h3>
        <p className="text-white/50 text-sm">
          فقط اولین جمله‌تو بنویس. ادامه‌ش با من.
        </p>
      </div>

    </div>
)}
    {isLoggedIn && hasData &&  messages.length === 0 && (
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
              <div className="w-full scale-[0.85] sm:scale-100 origin-top min-h-[200px]  " >
                <CurrentWeatherWidget
                  temperature="آرام"
                  location="وضعیت احساسی امروز"
                />
              </div>
            </div>

        </div>
      </section>
    )}





    <section className="flex-1 flex pb-4 ">
      <div className="max-w-3xl mx-auto w-full h-full ">
        <ChatContainer messages={messages} setMessages={setMessages} />
      </div>
    </section>


      </main>
    </div>
  );
}