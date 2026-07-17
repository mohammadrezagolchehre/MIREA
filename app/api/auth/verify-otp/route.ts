import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  createRegistrationTicket,
  createSession,
  matchesOtp,
} from "@/lib/auth/session";
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

type OtpRow = {
  id: string;
  code: string;
  attempts: number;
};

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
};

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  try {
    const body = (await req.json()) as { phone?: unknown; code?: unknown };
    const phone = normalizePhone(body.phone);
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!phone || !/^\d{5}$/.test(code)) {
      return NextResponse.json(
        { error: "اطلاعات ورود معتبر نیست" },
        { status: 400 }
      );
    }

    const ip = getClientAddress(req);
    await enforceRateLimit("verify-ip", ip, 20, 10 * 60);
    await enforceRateLimit("verify-phone", phone, 10, 10 * 60);

    const [otp] = await db<OtpRow>(
      `SELECT id, code, attempts
       FROM otp_codes
       WHERE phone = $1
         AND used = false
         AND expires_at > now()
         AND attempts < 5
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone]
    );

    if (!otp || !matchesOtp(otp.code, phone, code)) {
      if (otp) {
        await db(
          `UPDATE otp_codes
           SET attempts = attempts + 1,
               used = attempts + 1 >= 5
           WHERE id = $1`,
          [otp.id]
        );
      }

      return NextResponse.json(
        { error: "کد اشتباه یا منقضی شده" },
        { status: 400 }
      );
    }

    await db("UPDATE otp_codes SET used = true WHERE id = $1", [otp.id]);

    const [existingUser] = await db<UserRow>(
      `SELECT id, phone, first_name, last_name, birth_date
       FROM users
       WHERE phone = $1
       LIMIT 1`,
      [phone]
    );

    if (!existingUser) {
      const response = NextResponse.json({ success: true, isNewUser: true });
      await createRegistrationTicket(phone, response);
      return response;
    }

    const user = {
      id: existingUser.id,
      phone: existingUser.phone,
      firstName: existingUser.first_name,
      lastName: existingUser.last_name ?? undefined,
      birthDate: existingUser.birth_date ?? undefined,
    };
    const response = NextResponse.json({
      success: true,
      isNewUser: false,
      user,
    });
    await createSession(user.id, response);
    return response;
  } catch (error) {
    if (error instanceof RateLimitError) return rateLimitResponse(error);
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "خطا در تایید کد" }, { status: 500 });
  }
}
