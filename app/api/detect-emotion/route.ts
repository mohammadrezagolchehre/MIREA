import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();
    if (!context) return NextResponse.json({ emotion: "neutral" });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 10,
      messages: [
        {
          role: "system",
          content: `تو یک تحلیلگر احساسات هستی. فقط یک کلمه انگلیسی از این لیست برگردان:
neutral, sad, anxious, angry, happy, calm

قوانین:
- sad: غم، ناراحتی، از دست دادن، گریه، دلتنگی
- anxious: استرس، اضطراب، نگرانی، ترس، وحشت
- angry: عصبانیت، خشم، ناامیدی شدید
- happy: شادی، خوشحالی، امید، هیجان مثبت
- calm: آرامش، مدیتیشن، سکوت، رضایت
- neutral: خنثی یا مشخص نیست

فقط یک کلمه، بدون توضیح.`,
        },
        {
          role: "user",
          content: context,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim().toLowerCase() ?? "neutral";
    const valid = ["neutral", "sad", "anxious", "angry", "happy", "calm"];
    const emotion = valid.includes(raw) ? raw : "neutral";

    return NextResponse.json({ emotion });

  } catch {
    return NextResponse.json({ emotion: "neutral" });
  }
}