import { NextRequest } from "next/server";
import type OpenAI from "openai";
import {
  getOpenRouterClient,
  getOpenRouterUserMessage,
  logOpenRouterError,
  OPENROUTER_FALLBACK_MODELS,
  OPENROUTER_MODEL,
} from "@/lib/openrouter";
import { getSessionUser } from "@/lib/auth/session";
import {
  forbiddenOrigin,
  getClientAddress,
  isSameOrigin,
} from "@/lib/request-security";
import {
  enforceRateLimit,
  RateLimitError,
  rateLimitResponse,
} from "@/lib/rate-limit";

const MIRA_SYSTEM_PROMPT = `
تو «میرآ» هستی؛ یک همراه فارسی‌زبان برای شناخت احساسات و خودآگاهی.

قواعد زبان و لحن:
- همیشه با فارسی ایرانیِ طبیعی، روان و امروزی جواب بده؛ مگر اینکه کاربر صریحاً زبان دیگری بخواهد.
- همیشه کاربر را مفرد خطاب کن و فقط از لحن «تو» استفاده کن: «می‌تونی»، «بهت» و «برات». هرگز «تو» و «شما» یا فعل مفرد و جمع را در یک پاسخ ترکیب نکن.
- از جمله‌های ترجمه‌ای، واژه‌های نامأنوس عربی، لحن رسمیِ خشک و تکرار بی‌دلیل حرف کاربر دوری کن.
- اگر کاربر محاوره‌ای می‌نویسد، صمیمی و محترمانه باش؛ اما بیش‌ازحد خودمانی یا شعاری نشو.
- مستقیماً پاسخ نهایی را بنویس و فرایند فکر کردن یا متن‌هایی مثل <think> را نمایش نده.
- قبل از ارسال، پاسخ را بی‌صدا از نظر دستور زبان، هماهنگی فعل‌ها و طبیعی‌بودن فارسی بازبینی و عبارت‌های نامأنوس را بازنویسی کن.
- مگر اینکه کاربر خودش استفاده کرده باشد، از ایموجی استفاده نکن.

قواعد گفت‌وگو:
- بدون قضاوت گوش کن و به یک جزئیات مشخص از حرف کاربر واکنش نشان بده تا پاسخ کلیشه‌ای نباشد.
- در گفت‌وگوی عادی پاسخ را در ۲ تا ۵ جمله نگه دار و حداکثر یک سؤال کوتاه و مرتبط بپرس.
- تا وقتی کاربر راهکار نخواسته، اول به فهم احساس و موقعیت او کمک کن؛ راه‌حل را تحمیل نکن.
- از شروع تکراری پاسخ‌ها با عبارت‌هایی مثل «می‌فهمم»، «متأسفم که...» و «این احساس کاملاً قابل درک است» پرهیز کن.
- فقط وقتی واقعاً مفید است از فهرست استفاده کن.

مرز ایمنی:
تو جای روان‌شناس یا روان‌پزشک نیستی و تشخیص پزشکی نمی‌دهی. اگر نشانه‌ای از خطر فوری، خودآزاری یا آسیب به دیگران دیدی، کاربر را روشن و آرام به تماس فوری با اورژانس، یک فرد امن یا متخصص سلامت روان تشویق کن.
`;

type HistoryItem = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGE_LENGTH = 4_000;
const MAX_HISTORY_ITEMS = 12;

function sanitizeHistory(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is HistoryItem =>
        Boolean(item) &&
        typeof item === "object" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string"
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  try {
    const user = await getSessionUser(req);
    const identity = user?.id ?? getClientAddress(req);
    await enforceRateLimit(
      user ? "chat-user" : "chat-guest",
      identity,
      user ? 60 : 20,
      10 * 60
    );

    const { message, history } = (await req.json()) as {
      message?: string;
      history?: unknown;
    };

    if (!message?.trim()) {
      return Response.json({ error: "پیام خالی است." }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: "پیام بیش از حد طولانی است." },
        { status: 413 }
      );
    }

    const safeHistory = sanitizeHistory(history);

    const completionRequest: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming & {
      models?: string[];
    } = {
      model: OPENROUTER_MODEL,
      models: OPENROUTER_FALLBACK_MODELS,
      stream: true,
      temperature: 0.45,
      max_tokens: 600,
      messages: [
        { role: "system", content: MIRA_SYSTEM_PROMPT },
        ...safeHistory.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        { role: "user", content: message.trim() },
      ],
    };

    const stream = await getOpenRouterClient().chat.completions.create(
      completionRequest
    );

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
    if (error instanceof RateLimitError) return rateLimitResponse(error);
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
