import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function generateOtp(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
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

    await db("DELETE FROM otp_codes WHERE phone = $1", [phone]);
    await db(
      "INSERT INTO otp_codes (phone, code, expires_at) VALUES ($1, $2, $3)",
      [phone, code, expiresAt.toISOString()]
    );

    console.log(`OTP for ${phone}: ${code}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: "خطا در ارسال کد" },
      { status: 500 }
    );
  }
}
