import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hasDatabaseUrl, saveDevUser } from "@/lib/dev-otp";

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const { phone, firstName, lastName, birthDate } = await req.json();

    if (!phone || !firstName || !birthDate) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    if (!hasDatabaseUrl()) {
      const user = {
        id: `dev-${phone}`,
        phone,
        firstName: firstName.trim(),
        lastName: lastName?.trim() || undefined,
        birthDate,
      };

      saveDevUser(user);

      return NextResponse.json({
        success: true,
        user,
      });
    }

    const [user] = await db<UserRow>(
      `INSERT INTO users (phone, first_name, last_name, birth_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (phone)
       DO UPDATE SET
         first_name = excluded.first_name,
         last_name = excluded.last_name,
         birth_date = excluded.birth_date,
         updated_at = now()
       RETURNING id, phone, first_name, last_name, birth_date`,
      [phone, firstName.trim(), lastName?.trim() || null, birthDate]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name ?? undefined,
        birthDate: user.birth_date ?? undefined,
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
