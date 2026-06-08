'use client';

import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/ui/glass-button";

export default function GuestHeader() {
  const router = useRouter();

  return (
    <header className="absolute top-6 right-6 z-20 flex gap-3">
      <GlassButton
        variant="subscription"
        onClick={() => router.push("/pricing")}
      >
        خرید اشتراک
      </GlassButton>

      <GlassButton
        variant="default"
        onClick={() => router.push("/auth/login")}
      >
        ورود
      </GlassButton>

      <GlassButton
        variant="primary"
        glowEffect
        onClick={() => router.push("/auth/signup")}
      >
        ثبت نام
      </GlassButton>
    </header>
  );
}