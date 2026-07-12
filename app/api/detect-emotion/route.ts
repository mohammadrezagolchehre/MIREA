import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient, OPENROUTER_MODEL } from "@/lib/openrouter";

const VALID_EMOTIONS = [
  "neutral",
  "sad",
  "anxious",
  "angry",
  "happy",
  "calm",
] as const;

type Emotion = (typeof VALID_EMOTIONS)[number];

const EMOTION_KEYWORDS: Array<{ emotion: Emotion; words: string[] }> = [
  { emotion: "angry", words: ["عصبانی", "خشمگین", "حرص", "کلافه", "متنفر"] },
  { emotion: "anxious", words: ["استرس", "اضطراب", "نگران", "ترس", "دلشوره"] },
  { emotion: "sad", words: ["غمگین", "ناراحت", "گریه", "دلتنگ", "افسرده"] },
  { emotion: "happy", words: ["خوشحال", "شاد", "هیجان", "عالی", "امیدوار"] },
  { emotion: "calm", words: ["آرام", "آرامش", "ریلکس", "سبک شدم", "راحت شدم"] },
];

function detectClearEmotion(context: string) {
  return EMOTION_KEYWORDS.find(({ words }) =>
    words.some((word) => context.includes(word))
  )?.emotion;
}

export async function POST(req: NextRequest) {
  try {
    const { context } = (await req.json()) as { context?: string };

    if (!context?.trim()) {
      return NextResponse.json({ emotion: "neutral" });
    }

    const clearEmotion = detectClearEmotion(context);
    if (clearEmotion) {
      return NextResponse.json({ emotion: clearEmotion });
    }

    const response = await getOpenRouterClient().chat.completions.create({
      model: OPENROUTER_MODEL,
      temperature: 0,
      max_tokens: 8,
      messages: [
        {
          role: "system",
          content:
            "احساس غالب متن را فقط با یکی از این کلمات برگردان و هیچ توضیحی نده: neutral, sad, anxious, angry, happy, calm",
        },
        { role: "user", content: context.slice(-4000) },
      ],
    });

    const raw = response.choices[0]?.message?.content
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const emotion = VALID_EMOTIONS.find((item) => item === raw) ?? "neutral";

    return NextResponse.json({ emotion });
  } catch (error) {
    console.error("OpenRouter emotion error:", error);
    return NextResponse.json({ emotion: "neutral" });
  }
}
