'use client';

import GradientText from "@/components/ui/GradiantText";
import { GlassButton } from "@/components/ui/glass-button";

interface EmptyViewProps {
  onStart: () => void;
}

export default function EmptyView({ onStart }: EmptyViewProps) {
  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-8 px-4">

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          خوش اومدی به <GradientText text="لیورا" />
        </h1>

        <p className="text-lg md:text-xl text-white/70">
          هنوز گفت‌وگویی شروع نکردی.
          <br />
          اولین پیام رو بفرست تا شروع کنیم.
        </p>
      </div>

      <GlassButton
        variant="primary"
        glowEffect
        onClick={onStart}
        className="px-8 py-3 text-lg"
      >
        شروع گفتگو
      </GlassButton>

    </section>
  );
}