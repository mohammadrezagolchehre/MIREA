import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "mira_session";
export const REGISTRATION_COOKIE = "mira_registration";

const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const REGISTRATION_TTL_SECONDS = 10 * 60;

export type SessionUser = {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  birthDate?: string;
};

type UserRow = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
};

function authSecret() {
  const secret = process.env.AUTH_SECRET ?? "";

  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters long");
  }

  return secret;
}

function secureCookie() {
  return process.env.NODE_ENV === "production";
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function mapUser(row: UserRow): SessionUser {
  return {
    id: row.id,
    phone: row.phone,
    firstName: row.first_name,
    lastName: row.last_name ?? undefined,
    birthDate: row.birth_date ?? undefined,
  };
}

export function hashOtp(phone: string, code: string) {
  return createHmac("sha256", authSecret())
    .update(`${phone}:${code}`)
    .digest("hex");
}

export function matchesOtp(storedHash: string, phone: string, code: string) {
  const candidate = hashOtp(phone, code);
  const storedBuffer = Buffer.from(storedHash, "hex");
  const candidateBuffer = Buffer.from(candidate, "hex");

  return (
    storedBuffer.length === candidateBuffer.length &&
    timingSafeEqual(storedBuffer, candidateBuffer)
  );
}

export async function createSession(userId: string, response: NextResponse) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await db("DELETE FROM auth_sessions WHERE expires_at <= now()");
  await db(
    `INSERT INTO auth_sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash(token), expiresAt.toISOString()]
  );

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function getSessionUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db<UserRow>(
    `SELECT u.id, u.phone, u.first_name, u.last_name, u.birth_date
     FROM auth_sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > now()
     LIMIT 1`,
    [tokenHash(token)]
  );

  return row ? mapUser(row) : null;
}

export async function revokeSession(req: NextRequest, response: NextResponse) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await db("DELETE FROM auth_sessions WHERE token_hash = $1", [tokenHash(token)]);
  }

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function createRegistrationTicket(
  phone: string,
  response: NextResponse
) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + REGISTRATION_TTL_SECONDS * 1000);

  await db(
    `DELETE FROM registration_tickets
     WHERE phone = $1 OR expires_at <= now()`,
    [phone]
  );
  await db(
    `INSERT INTO registration_tickets (phone, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [phone, tokenHash(token), expiresAt.toISOString()]
  );

  response.cookies.set(REGISTRATION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "strict",
    path: "/api/auth",
    maxAge: REGISTRATION_TTL_SECONDS,
  });
}

export function registrationTokenHash(req: NextRequest) {
  const token = req.cookies.get(REGISTRATION_COOKIE)?.value;
  return token ? tokenHash(token) : null;
}

export function clearRegistrationCookie(response: NextResponse) {
  response.cookies.set(REGISTRATION_COOKIE, "", {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 0,
  });
}
