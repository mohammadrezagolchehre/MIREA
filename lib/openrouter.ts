import OpenAI from "openai";

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "openrouter/free";

export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    timeout: 45_000,
    maxRetries: 1,
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME ?? "Mirea",
    },
  });
}

export function logOpenRouterError(scope: string, error: unknown) {
  const details = error as {
    status?: number;
    code?: string;
    message?: string;
    error?: unknown;
  };

  console.error(`${scope}:`, {
    status: details.status,
    code: details.code,
    message: details.message,
    error: details.error,
    model: OPENROUTER_MODEL,
  });
}

export function getOpenRouterUserMessage(error: unknown) {
  const details = error as { status?: number; code?: string; message?: string };
  const message = details.message ?? "";

  if (message.includes("OPENROUTER_API_KEY")) {
    return "کلید OpenRouter تنظیم نشده است.";
  }

  if (details.status === 401) {
    return "کلید OpenRouter معتبر نیست.";
  }

  if (details.status === 429) {
    return "مدل‌های رایگان OpenRouter فعلاً شلوغ هستند؛ کمی بعد دوباره امتحان کن.";
  }

  if (details.status === 403) {
    return "دسترسی به OpenRouter از این شبکه رد شد.";
  }

  if (details.status === 404) {
    return "مدل رایگان OpenRouter در دسترس نیست.";
  }

  return "در دریافت پاسخ از OpenRouter مشکلی پیش آمد.";
}
