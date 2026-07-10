import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hasDatabaseUrl, isTestOtpValid, saveDevOtp } from "@/lib/dev-otp";

function generateOtp(): string {
  if (process.env.OTP_TEST_CODE) {
    return process.env.OTP_TEST_CODE;
  }

  return Math.floor(10000 + Math.random() * 90000).toString();
}

function logOtp(phone: string, code: string) {
  if (process.env.NODE_ENV === "production" && process.env.OTP_DEBUG !== "true") {
    return;
  }

  console.info("");
  console.info("========================================");
  console.info(" MIREA LOGIN OTP");
  console.info(` Phone: ${phone}`);
  console.info(` Code:  ${code}`);
  console.info(" Expires in: 2 minutes");
  console.info("========================================");
  console.info("");
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: "شماره تلفن معتبر نیست" },
        { status: 400 }
      );
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    logOtp(phone, code);

    if (isTestOtpValid(code) || !hasDatabaseUrl()) {
      saveDevOtp(phone, code, expiresAt);

      if (!hasDatabaseUrl()) {
        console.warn("DATABASE_URL is not set. Using in-memory OTP for local testing.");
      }

      return NextResponse.json({ success: true });
    }

    await db("DELETE FROM otp_codes WHERE phone = $1", [phone]);
    await db(
      "INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)",
      [phone, code, expiresAt.toISOString()]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: "خطا در ارسال کد" },
      { status: 500 }
    );
  }
}
