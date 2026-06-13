'use client';

import { useState, useCallback } from "react";

export type Emotion = "neutral" | "sad" | "anxious" | "angry" | "happy" | "calm";

export type EmotionColors = {
  color1: string;
  color2: string;
  color3: string;
};

export const EMOTION_COLORS: Record<Emotion, EmotionColors> = {
  neutral: { color1: "#FF9FFC", color2: "#5227FF", color3: "#B19EEF" }, // پیش‌فرض میرآ
  sad:     { color1: "#4a6fa5", color2: "#1a2a4a", color3: "#2d4a7a" }, // آبی سرد تیره
  anxious: { color1: "#7b2d8b", color2: "#2d1b4e", color3: "#4a1a6b" }, // بنفش تیره
  angry:   { color1: "#c0392b", color2: "#2c0a0a", color3: "#7b1a1a" }, // قرمز تیره
  happy:   { color1: "#27ae60", color2: "#1a3d2b", color3: "#52c77a" }, // سبز گرم
  calm:    { color1: "#5dade2", color2: "#1a2d3d", color3: "#85c1e9" }, // آبی آروم
};

export function useEmotionColor() {
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

  return { emotion, colors, detectEmotion };
}