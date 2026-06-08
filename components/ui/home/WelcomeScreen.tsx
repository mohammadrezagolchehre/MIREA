'use client';

import { motion } from "framer-motion";
import OptionChips from "@/components/ui/Liora/OptionChips";

type Props = {
  firstName: string;
  onSelect: (text: string) => void;
};

const taglines = [
  "اینجام تا بشنوم.",
  "هر چی توی ذهنته، بگو.",
  "قضاوتی نیست، فقط گوش دادن.",
];

// هر بار یه tagline تصادفی
const tagline = taglines[Math.floor(Math.random() * taglines.length)];

export default function WelcomeScreen({ firstName, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8  select-none">

      {/* Avatar / Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl scale-150" />

        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl">
          <span className="text-2xl">🌿</span>
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        dir="rtl"
        className="text-center space-y-3"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          سلام {firstName} 👋
        </h1>
        <p className="text-white/50 text-base md:text-lg">
          {tagline}
        </p>
      </motion.div>

      {/* Option Chips */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <p className="text-white/30 text-xs text-center mb-4">یا از اینجا شروع کن</p>
        <OptionChips onSelect={onSelect} />
      </motion.div>

    </div>
  );
}