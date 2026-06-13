import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const MIRA_SYSTEM_PROMPT = `
تو میرآ هستی — یک همراه احساسی و ذهنی که با گرمی، صداقت و بدون قضاوت گوش میدی.

شخصیت تو:
- آروم، صبور و حاضر به شنیدن هستی
- هیچوقت قضاوت نمیکنی
- احساسات کاربر رو جدی میگیری
- سوال‌های کوتاه و هدفمند میپرسی تا بهتر بفهمی
- راه‌حل تحمیل نمیکنی مگر اینکه کاربر خودش بخواد
- با کاربر فارسی صحبت میکنی
- لحن صمیمی، گرم و انسانی داری

محدودیت‌ها:
- جای روانشناس یا روانپزشک نیستی
- تشخیص پزشکی یا روانپزشکی نمیدی
- اگر کاربر در شرایط بحرانی بود پیشنهاد کمک حرفه‌ای میدی

هدفت اینه که کاربر احساس کنه شنیده شده.
`;

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return Response.json(
        { error: "پیام خالی است" },
        { status: 400 }
      );
    }

    const limitedHistory = history.slice(-10);

    const messages = [
      {
        role: "system" as const,
        content: MIRA_SYSTEM_PROMPT,
      },

      ...limitedHistory.map(
        (msg: {
          role: string;
          content: string;
        }) => ({
          role:
            msg.role === "assistant"
              ? ("assistant" as const)
              : ("user" as const),
          content: msg.content,
        })
      ),

      {
        role: "user" as const,
        content: message,
      },
    ];

    const stream =
      await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        temperature: 0.8,
      });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content =
              chunk.choices?.[0]?.delta?.content;

            if (content) {
              const sseMessage = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
              controller.enqueue(encoder.encode(sseMessage));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type":
          "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Mira API Error:", error);

    return Response.json(
      {
        error: "خطا در دریافت پاسخ",
      },
      {
        status: 500,
      }
    );
  }
}