'use client';

import { useEmotion } from "../context/EmotionContext";
import Background from "@/components/ui/background";

export default function BackgroundWrapper() {
  const { colors } = useEmotion();

  return (
    <Background
      color1={colors.color1}
      color2={colors.color2}
      color3={colors.color3}
    />
  );
}