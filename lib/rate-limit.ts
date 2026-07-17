import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RateLimitRow = {
  count: number;
  retry_after: number;
};

export class RateLimitError extends Error {
  constructor(public readonly retryAfter: number) {
    super("Rate limit exceeded");
  }
}

function rateLimitKey(scope: string, identifier: string) {
  const secret = process.env.AUTH_SECRET ?? "";
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters long");
  }

  return createHmac("sha256", secret)
    .update(`${scope}:${identifier}`)
    .digest("hex");
}

export async function enforceRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number
) {
  const [row] = await db<RateLimitRow>(
    `INSERT INTO rate_limits (key, count, expires_at)
     VALUES ($1, 1, now() + ($2::integer * interval '1 second'))
     ON CONFLICT (key)
     DO UPDATE SET
       count = CASE
         WHEN rate_limits.expires_at <= now() THEN 1
         ELSE rate_limits.count + 1
       END,
       expires_at = CASE
         WHEN rate_limits.expires_at <= now()
           THEN now() + ($2::integer * interval '1 second')
         ELSE rate_limits.expires_at
       END
     RETURNING count,
       greatest(1, ceil(extract(epoch from (expires_at - now()))))::integer AS retry_after`,
    [rateLimitKey(scope, identifier), windowSeconds]
  );

  if (row.count > limit) {
    throw new RateLimitError(row.retry_after);
  }
}

export function rateLimitResponse(error: RateLimitError) {
  return NextResponse.json(
    { error: "درخواست‌ها بیش از حد سریع ارسال شدند؛ کمی بعد دوباره تلاش کن." },
    {
      status: 429,
      headers: { "Retry-After": String(error.retryAfter) },
    }
  );
}
