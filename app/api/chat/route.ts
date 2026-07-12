import { NextRequest } from "next/server";
import {
  getOpenRouterClient,
  getOpenRouterUserMessage,
  logOpenRouterError,
  OPENROUTER_MODEL,
} from "@/lib/openrouter";

const MIRA_SYSTEM_PROMPT = `
تو میرآ هستی؛ یک همراه برای احساسات و خودآگاهی.

همیشه به فارسی روان، صمیمی و محترمانه پاسخ بده. بدون قضاوت گوش کن، احساس کاربر را جدی بگیر و برای فهم بهتر سؤال‌های کوتاه و هدفمند بپرس. راه‌حل را تحمیل نکن، مگر اینکه کاربر راهکار بخواهد. پاسخ‌ها را کوتاه، انسانی و کاربردی نگه دار.

تو جای روان‌شناس یا روان‌پزشک نیستی و تشخیص پزشکی نمی‌دهی. اگر نشانه‌ای از خطر فوری، خودآزاری یا آسیب به دیگران دیدی، کاربر را به تماس فوری با اورژانس، یک فرد امن یا متخصص سلامت روان تشویق کن.
`;

type HistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = (await req.json()) as {
      message?: string;
      history?: HistoryItem[];
    };

    if (!message?.trim()) {
      return Response.json({ error: "پیام خالی است." }, { status: 400 });
    }

    const stream = await getOpenRouterClient().chat.completions.create({
      model: OPENROUTER_MODEL,
      stream: true,
      temperature: 0.75,
      messages: [
        { role: "system", content: MIRA_SYSTEM_PROMPT },
        ...history.slice(-10).map((item) => ({
          role: item.role,
          content: item.content,
        })),
        { role: "user", content: message.trim() },
      ],
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
                )
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    logOpenRouterError("OpenRouter chat error", error);

    return Response.json(
      {
        error: "خطا در دریافت پاسخ",
        details: getOpenRouterUserMessage(error),
      },
      { status: 500 }
    );
  }
}
