'use client';

import { StatsGrid } from "@/components/stats-widget";
import { CurrentWeatherWidget } from "@/components/weather-widget";
import { StockTickerWidget } from "@/components/stock-widget";

export default function DashboardView() {
  return (
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
  );
}