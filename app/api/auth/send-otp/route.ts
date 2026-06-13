import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// service role — فقط سمت سرور
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

function generateOtp(): string {
  return Math.floor(10000 + Math.random() * 90000).toString(); // ۵ رقم
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "شماره تلفن معتبر نیست" }, { status: 400 });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // ۲ دقیقه

    // کدهای قبلی این شماره رو پاک کن
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .eq("phone", phone);

    // کد جدید ذخیره کن
    const { error } = await supabaseAdmin
      .from("otp_codes")
      .insert({ phone, code, expires_at: expiresAt.toISOString() });

    if (error) throw error;

    // TODO: بعداً به SMS.ir یا Kavenegar وصل کن
    // فعلاً Mock — کد رو توی console میبینی
    console.log(`OTP for ${phone}: ${code}`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "خطا در ارسال کد" }, { status: 500 });
  }
}