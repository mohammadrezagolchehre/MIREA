import { randomInt } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashOtp } from "@/lib/auth/session";
import {
  forbiddenOrigin,
  getClientAddress,
  isSameOrigin,
  normalizePhone,
} from "@/lib/request-security";
import {
  enforceRateLimit,
  RateLimitError,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { developmentOtpCode, sendOtpSms } from "@/lib/sms";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  let phone: string | null = null;

  try {
    const body = (await req.json()) as { phone?: unknown };
    phone = normalizePhone(body.phone);

    if (!phone) {
      return NextResponse.json(
        { error: "شماره تلفن معتبر نیست" },
        { status: 400 }
      );
    }

    const ip = getClientAddress(req);
    await enforceRateLimit("otp-ip", ip, 10, 10 * 60);
    await enforceRateLimit("otp-phone", phone, 5, 10 * 60);

    const code = developmentOtpCode() ?? randomInt(10_000, 100_000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await db("DELETE FROM otp_codes WHERE phone = $1 OR expires_at <= now()", [
      phone,
    ]);
    await db(
      `INSERT INTO otp_codes (phone, code, expires_at)
       VALUES ($1, $2, $3)`,
      [phone, hashOtp(phone, code), expiresAt.toISOString()]
    );

    try {
      await sendOtpSms(phone, code);
    } catch (error) {
      await db("DELETE FROM otp_codes WHERE phone = $1", [phone]);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RateLimitError) return rateLimitResponse(error);

    console.error("send-otp error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      phoneConfigured: Boolean(phone),
    });
    return NextResponse.json(
      { error: "ارسال کد فعلاً ممکن نیست؛ کمی بعد دوباره تلاش کن." },
      { status: 503 }
    );
  }
}
