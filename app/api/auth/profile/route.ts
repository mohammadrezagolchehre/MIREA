import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { forbiddenOrigin, isSameOrigin } from "@/lib/request-security";

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
};

export async function PATCH(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  try {
    const currentUser = await getSessionUser(req);
    if (!currentUser) {
      return NextResponse.json({ error: "وارد حساب نشده‌ای" }, { status: 401 });
    }

    const body = (await req.json()) as {
      firstName?: unknown;
      lastName?: unknown;
      birthDate?: unknown;
    };
    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : currentUser.firstName;
    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : currentUser.lastName ?? "";
    const birthDate =
      typeof body.birthDate === "string"
        ? body.birthDate
        : currentUser.birthDate ?? null;

    if (
      firstName.length < 2 ||
      firstName.length > 50 ||
      lastName.length > 50 ||
      (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate))
    ) {
      return NextResponse.json(
        { error: "اطلاعات پروفایل معتبر نیست" },
        { status: 400 }
      );
    }

    const [user] = await db<UserRow>(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           birth_date = $3,
           updated_at = now()
       WHERE id = $4
       RETURNING id, phone, first_name, last_name, birth_date`,
      [firstName, lastName || null, birthDate, currentUser.id]
    );

    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name ?? undefined,
        birthDate: user.birth_date ?? undefined,
      },
    });
  } catch (error) {
    console.error("profile update error:", error);
    return NextResponse.json({ error: "خطا در ویرایش پروفایل" }, { status: 500 });
  }
}
