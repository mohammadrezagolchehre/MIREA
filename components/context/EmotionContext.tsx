'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Emotion = "neutral" | "sad" | "anxious" | "angry" | "happy" | "calm";

export type EmotionColors = {
  color1: string;
  color2: string;
  color3: string;
};

export const EMOTION_COLORS: Record<Emotion, EmotionColors> = {
  neutral: { color1: "#120c6e", color2: "#1E293B", color3: "#ff9190" }, // پیش‌فرض میرآ
  sad:     { color1: "#1a2a4a", color2: "#0d1b2a", color3: "#4a6fa5" }, // آبی سرد تیره
  anxious: { color1: "#2d1b4e", color2: "#1a0533", color3: "#7b2d8b" }, // بنفش تیره
  angry:   { color1: "#3d1515", color2: "#2a0a0a", color3: "#c0392b" }, // قرمز تیره
  happy:   { color1: "#1a3d2b", color2: "#0a2a1a", color3: "#52c77a" }, // سبز گرم
  calm:    { color1: "#1a2d3d", color2: "#0a1a2a", color3: "#5dade2" }, // آبی آروم
};

type EmotionContextType = {
  colors: EmotionColors;
  emotion: Emotion;
  detectEmotion: (messages: { role: string; content: string }[]) => Promise<void>;
};

const EmotionContext = createContext<EmotionContextType>({
  colors: EMOTION_COLORS.neutral,
  emotion: "neutral",
  detectEmotion: async () => {},
});

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [colors, setColors] = useState<EmotionColors>(EMOTION_COLORS.neutral);

  const detectEmotion = useCallback(async (messages: { role: string; content: string }[]) => {
    if (messages.length < 2) return;

    const recentMessages = messages.slice(-3);
    const context = recentMessages
      .map((m) => `${m.role === "user" ? "کاربر" : "میرآ"}: ${m.content}`)
      .join("\n");

    try {
      const res = await fetch("/api/detect-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      if (!res.ok) return;
      const data = await res.json();

      if (data.emotion && data.emotion in EMOTION_COLORS) {
        const newEmotion = data.emotion as Emotion;
        setEmotion(newEmotion);
        setColors(EMOTION_COLORS[newEmotion]);
      }
    } catch {
      // silent fail
    }
  }, []);

  return (
    <EmotionContext.Provider value={{ colors, emotion, detectEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  return useContext(EmotionContext);
}