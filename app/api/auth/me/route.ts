import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("auth me error:", error);
    return NextResponse.json({ error: "خطا در دریافت نشست" }, { status: 500 });
  }
}
