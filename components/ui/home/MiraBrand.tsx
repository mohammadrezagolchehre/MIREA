'use client';

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  className?: string;
};

export default function MiraBrand({ compact = false, className }: Props) {
  const size = compact ? 30 : 40;

  return (
    <div className={cn("flex shrink-0 items-center gap-2.5", className)} dir="rtl">
      <Image
        src="/mira-logo.png"
        alt="لوگوی میرآ"
        width={size}
        height={size}
        priority={!compact}
        className="rounded-lg border border-white/15 shadow-[0_6px_20px_rgba(6,182,212,0.18)]"
      />
      <span className={cn("font-semibold text-white/85", compact ? "text-sm" : "text-base")}>
        میرآ
      </span>
    </div>
  );
}
