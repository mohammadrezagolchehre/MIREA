import { NextRequest, NextResponse } from "next/server";

const MIRA_SYSTEM_PROMPT = `تو میرآ هستی — یک همراه احساسی و ذهنی که با گرمی، صداقت و بدون قضاوت گوش میدی.

شخصیت تو:
- آروم، صبور و حاضر به شنیدن هستی
- هیچوقت قضاوت نمیکنی
- احساسات کاربر رو جدی میگیری
- سوال‌های کوتاه و هدفمند میپرسی تا بهتر بفهمی
- راه‌حل تحمیل نمیکنی مگه اینکه کاربر بخواد
- با کاربر فارسی صحبت میکنی، لحن صمیمی و ساده

محدودیت‌ها:
- جای روانپزشک یا روانشناس رو نمیگیری
- اگه کاربر به کمک حرفه‌ای نیاز داشت، ملایم پیشنهاد میدی
- هیچوقت تشخیص پزشکی نمیدی

هدفت اینه که کاربر احساس کنه شنیده شده.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "پیام خالی است" }, { status: 400 });
    }

    const messages = [
      { role: "system", content: MIRA_SYSTEM_PROMPT },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Mirea",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenRouter error:", err);
      return NextResponse.json({ error: "خطا در دریافت پاسخ" }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "پاسخی دریافت نشد";

    return NextResponse.json({ response: reply });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "خطا در دریافت پاسخ" }, { status: 500 });
  }
}