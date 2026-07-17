import { NextRequest, NextResponse } from "next/server";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function normalizePhone(input: unknown) {
  if (typeof input !== "string") return null;

  let value = input.trim();
  value = value.replace(/[۰-۹]/g, (digit) =>
    String(PERSIAN_DIGITS.indexOf(digit))
  );
  value = value.replace(/[٠-٩]/g, (digit) =>
    String(ARABIC_DIGITS.indexOf(digit))
  );
  value = value.replace(/[\s()-]/g, "");

  if (value.startsWith("+98")) value = `0${value.slice(3)}`;
  if (value.startsWith("0098")) value = `0${value.slice(4)}`;

  return /^09\d{9}$/.test(value) ? value : null;
}

export function getClientAddress(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  try {
    const originUrl = new URL(origin);
    const forwardedHost =
      req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return Boolean(forwardedHost && originUrl.host === forwardedHost);
  } catch {
    return false;
  }
}

export function forbiddenOrigin() {
  return NextResponse.json({ error: "درخواست نامعتبر است" }, { status: 403 });
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}
