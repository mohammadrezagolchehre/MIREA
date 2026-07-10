import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName } = await req.json();

    if (!phone || !firstName) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    const [user] = await db<UserRow>(
      `INSERT INTO users (phone, first_name, last_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (phone)
       DO UPDATE SET
         first_name = excluded.first_name,
         last_name = excluded.last_name,
         updated_at = now()
       RETURNING id, phone, first_name, last_name`,
      [phone, firstName.trim(), lastName?.trim() || null]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name ?? undefined,
      },
    });
  } catch (error) {
    console.error("register error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت نام" },
      { status: 500 }
    );
  }
}
