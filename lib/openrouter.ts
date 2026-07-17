import OpenAI from "openai";

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct:free";

const DEFAULT_FALLBACK_MODELS = [
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "google/gemma-4-31b-it:free",
];

export const OPENROUTER_FALLBACK_MODELS = (
  process.env.OPENROUTER_FALLBACK_MODELS?.split(",") ?? DEFAULT_FALLBACK_MODELS
)
  .map((model) => model.trim())
  .filter((model) => model && model !== OPENROUTER_MODEL);

export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    timeout: 30_000,
    maxRetries: 0,
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "Mira",
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

  if (details.status === 402 || details.status === 429) {
    return "مدل‌های رایگان OpenRouter فعلاً شلوغ هستند؛ کمی بعد دوباره امتحان کن.";
  }

  if (details.status === 502 || details.status === 503) {
    return "سرویس هوش مصنوعی موقتاً در دسترس نیست؛ کمی بعد دوباره امتحان کن.";
  }

  if (details.status === 403) {
    return "دسترسی به OpenRouter از این شبکه رد شد.";
  }

  if (details.status === 404) {
    return "مدل رایگان OpenRouter در دسترس نیست.";
  }

  if (
    details.code === "ETIMEDOUT" ||
    details.code === "ECONNABORTED" ||
    /timed?\s*out|connection error|fetch failed/i.test(message)
  ) {
    return "اتصال به OpenRouter برقرار نشد. اینترنت یا دسترسی شبکه را بررسی کن.";
  }

  return "در دریافت پاسخ از OpenRouter مشکلی پیش آمد.";
}
