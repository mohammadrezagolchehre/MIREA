import { NextRequest, NextResponse } from "next/server";
import { revokeSession } from "@/lib/auth/session";
import { forbiddenOrigin, isSameOrigin } from "@/lib/request-security";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  const response = NextResponse.json({ success: true });
  await revokeSession(req, response);
  return response;
}
