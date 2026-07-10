'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import OptionChips from "@/components/ui/Liora/OptionChips";
import { Sparkles } from "lucide-react";

type Props = {
  firstName: string;
  onSelect: (text: string) => void;
};

const taglines = [
  "اینجام تا بشنوم.",
  "هر چی توی ذهنته، بگو.",
  "قضاوتی نیست، فقط گوش دادن.",
];

export default function WelcomeScreen({ firstName, onSelect }: Props) {
  const [tagline] = useState(() => taglines[Math.floor(Math.random() * taglines.length)]);

  return (
    <motion.div
      className="flex h-full select-none flex-col items-center justify-center gap-5 px-1 py-4 sm:gap-8 sm:py-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        initial={{ y: 14, scale: 0.88, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="absolute inset-0 scale-150 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute -inset-3 rounded-full border border-cyan-300/10" />
        <motion.div
          className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-300/25 via-blue-400/10 to-transparent blur-md"
          animate={{ opacity: [0.45, 0.8, 0.45], scale: [0.98, 1.03, 0.98] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-[0_18px_48px_rgba(6,182,212,0.14)] backdrop-blur-2xl sm:h-[4.5rem] sm:w-[4.5rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 via-blue-500/15 to-white/5" />
          <div className="absolute bottom-2 h-7 w-7 rounded-full bg-cyan-300/20 blur-lg" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/25 bg-black/20">
            <Sparkles size={18} className="text-cyan-200/90" />
          </div>
        </div>
      </motion.div>

      <motion.div
        dir="rtl"
        className="space-y-2 text-center sm:space-y-3"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
      >
        <h1 className="text-xl font-bold text-white/90 sm:text-2xl md:text-3xl">
          سلام {firstName}
        </h1>
        <motion.p
          className="text-sm text-white/50 sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55, ease: "easeOut" }}
        >
          {tagline}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.34, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <p className="mb-4 text-center text-xs text-white/30">یا از اینجا شروع کن</p>
        <OptionChips onSelect={onSelect} />
      </motion.div>
    </motion.div>
  );
}
