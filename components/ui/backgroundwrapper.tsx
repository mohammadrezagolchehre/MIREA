'use client';

import { useEmotion } from "../context/EmotionContext";
import Background from "@/components/ui/background";
import { motion } from "framer-motion";

const emotionLabels = {
  neutral: "خنثی",
  sad: "غمگین",
  anxious: "مضطرب",
  angry: "خشمگین",
  happy: "شاد",
  calm: "آرام",
};

export default function BackgroundWrapper() {
  const { colors, emotion } = useEmotion();

  return (
    <>
      <Background
        color1={colors.color1}
        color2={colors.color2}
        color3={colors.color3}
      />
      <motion.div
        key={emotion}
        dir="rtl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="pointer-events-none fixed bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-white/45 shadow-[0_10px_28px_rgba(0,0,0,0.14)] backdrop-blur-xl"
      >
        <span
          className="h-1.5 w-1.5 rounded-full shadow-[0_0_18px_currentColor]"
          style={{ backgroundColor: colors.color3, color: colors.color3 }}
        />
        <span>حال و هوا: {emotionLabels[emotion]}</span>
      </motion.div>
    </>
  );
}
