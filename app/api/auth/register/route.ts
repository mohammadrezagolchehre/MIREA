import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName } = await req.json();

    if (!phone || !firstName) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    // کاربر جدید بساز
    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        phone,
        first_name: firstName.trim(),
        last_name: lastName?.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      },
    });

  } catch (error) {
    console.error("register error:", error);
    return NextResponse.json({ error: "خطا در ثبت‌نام" }, { status: 500 });
  }
}