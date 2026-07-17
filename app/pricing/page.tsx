'use client';

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/ui/glass-button";
import MiraBrand from "@/components/ui/home/MiraBrand";

export default function PricingPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col px-4 py-4 sm:px-6">
      <header className="flex items-center justify-between">
        <MiraBrand />
        <GlassButton
          variant="ghost"
          className="gap-2"
          onClick={() => router.push("/")}
        >
          <ArrowRight aria-hidden="true" />
          بازگشت
        </GlassButton>
      </header>

      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center pb-16 text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-cyan-200/20 bg-white/[0.08] text-cyan-100 shadow-[0_12px_36px_rgba(34,211,238,0.14)] backdrop-blur-xl">
          <Sparkles aria-hidden="true" className="size-6" />
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          اشتراک ویژه میرآ به‌زودی
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-white/60 sm:text-base">
          نسخه فعلی میرآ در دوره آزمایشی رایگان است. جزئیات اشتراک پس از تکمیل امکانات و بررسی بازخورد کاربران اعلام می‌شود.
        </p>
      </section>
    </main>
  );
}
