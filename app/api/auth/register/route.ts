import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  clearRegistrationCookie,
  createSession,
  registrationTokenHash,
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

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
};

function validBirthDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  const earliest = new Date();
  earliest.setUTCFullYear(earliest.getUTCFullYear() - 120);
  return !Number.isNaN(date.getTime()) && date <= new Date() && date >= earliest;
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  try {
    const body = (await req.json()) as {
      phone?: unknown;
      firstName?: unknown;
      lastName?: unknown;
      birthDate?: unknown;
    };
    const phone = normalizePhone(body.phone);
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";
    const birthDate = body.birthDate;
    const ticketHash = registrationTokenHash(req);

    if (
      !phone ||
      firstName.length < 2 ||
      firstName.length > 50 ||
      lastName.length > 50 ||
      !validBirthDate(birthDate) ||
      !ticketHash
    ) {
      return NextResponse.json(
        { error: "اطلاعات ثبت‌نام معتبر نیست" },
        { status: 400 }
      );
    }

    await enforceRateLimit("register-ip", getClientAddress(req), 10, 60 * 60);

    const [user] = await db<UserRow>(
      `WITH valid_ticket AS (
         UPDATE registration_tickets
         SET used = true
         WHERE token_hash = $1
           AND phone = $2
           AND used = false
           AND expires_at > now()
         RETURNING phone
       )
       INSERT INTO users (phone, first_name, last_name, birth_date)
       SELECT $2, $3, $4, $5
       FROM valid_ticket
       ON CONFLICT (phone)
       DO UPDATE SET
         first_name = excluded.first_name,
         last_name = excluded.last_name,
         birth_date = excluded.birth_date,
         updated_at = now()
       RETURNING id, phone, first_name, last_name, birth_date`,
      [ticketHash, phone, firstName, lastName || null, birthDate]
    );

    if (!user) {
      return NextResponse.json(
        { error: "تایید شماره منقضی شده؛ دوباره کد بگیر" },
        { status: 403 }
      );
    }

    const authUser = {
      id: user.id,
      phone: user.phone,
      firstName: user.first_name,
      lastName: user.last_name ?? undefined,
      birthDate: user.birth_date ?? undefined,
    };
    const response = NextResponse.json({ success: true, user: authUser });
    clearRegistrationCookie(response);
    await createSession(user.id, response);
    return response;
  } catch (error) {
    if (error instanceof RateLimitError) return rateLimitResponse(error);
    console.error("register error:", error);
    return NextResponse.json({ error: "خطا در ثبت نام" }, { status: 500 });
  }
}
