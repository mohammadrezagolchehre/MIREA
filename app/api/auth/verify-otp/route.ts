import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consumeDevOtp, getDevUser, hasDatabaseUrl, isTestOtpValid } from "@/lib/dev-otp";

type OtpRow = {
  id: string;
};

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    let otpData: OtpRow | undefined;
    const hasValidDevOtp = isTestOtpValid(code) || consumeDevOtp(phone, code);

    if (hasValidDevOtp && !hasDatabaseUrl()) {
      const devUser = getDevUser(phone);

      if (!devUser) {
        return NextResponse.json({
          success: true,
          isNewUser: true,
          phone,
        });
      }

      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: devUser,
      });
    }

    if (!hasValidDevOtp) {
      [otpData] = await db<OtpRow>(
        `SELECT id
         FROM otp_codes
         WHERE phone = $1
           AND code = $2
           AND used = false
           AND expires_at > now()
         ORDER BY created_at DESC
         LIMIT 1`,
        [phone, code]
      );

      if (!otpData) {
        return NextResponse.json(
          { error: "کد اشتباه یا منقضی شده" },
          { status: 400 }
        );
      }

      await db("UPDATE otp_codes SET used = true WHERE id = $1", [otpData.id]);
    }

    const [existingUser] = await db<UserRow>(
      `SELECT id, phone, first_name, last_name, birth_date
       FROM users
       WHERE phone = $1
       LIMIT 1`,
      [phone]
    );

    if (existingUser) {
      return NextResponse.json({
        success: true,
        isNewUser: false,
        user: {
          id: existingUser.id,
          phone: existingUser.phone,
          firstName: existingUser.first_name,
          lastName: existingUser.last_name ?? undefined,
          birthDate: existingUser.birth_date ?? undefined,
        },
      });
    }

    return NextResponse.json({
      success: true,
      isNewUser: true,
      phone,
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: "خطا در تایید کد" },
      { status: 500 }
    );
  }
}
