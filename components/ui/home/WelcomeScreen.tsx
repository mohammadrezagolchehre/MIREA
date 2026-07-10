'use client';

import { useState } from "react";
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

export default function WelcomeScreen({ firstName, onSelect }: Props) {
  const [tagline] = useState(() => taglines[Math.floor(Math.random() * taglines.length)]);

  return (
    <motion.div
      className="flex min-h-0 flex-1 select-none flex-col items-center justify-center gap-4 px-1 py-4 text-center sm:gap-5 sm:py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        dir="rtl"
        className="space-y-2 sm:space-y-3"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-white/90 md:text-5xl">
          سلام {firstName}
        </h1>
        <motion.p
          className="text-base text-white/50 md:text-xl"
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
        className="w-full max-w-xl pt-4"
      >
        <p className="mb-4 text-center text-xs text-white/30">یا از اینجا شروع کن</p>
        <OptionChips onSelect={onSelect} />
      </motion.div>
    </motion.div>
  );
}
