import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    // کد رو پیدا کن
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from("otp_codes")
      .select("*")
      .eq("phone", phone)
      .eq("code", code)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (otpError || !otpData) {
      return NextResponse.json({ error: "کد اشتباه یا منقضی شده" }, { status: 400 });
    }

    // کد رو used کن
    await supabaseAdmin
      .from("otp_codes")
      .update({ used: true })
      .eq("id", otpData.id);

    // چک کن کاربر قبلاً ثبت‌نام کرده؟
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (existingUser) {
      // کاربر قدیمی — مستقیم لاگین
      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: {
          id: existingUser.id,
          phone: existingUser.phone,
          firstName: existingUser.first_name,
          lastName: existingUser.last_name,
        },
      });
    } else {
      // کاربر جدید — باید اسم بده
      return NextResponse.json({
        success: true,
        isNewUser: true,
        phone,
      });
    }

  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "خطا در تأیید کد" }, { status: 500 });
  }
}