import { NextRequest, NextResponse } from "next/server";
import type { Message } from "@/app/types/message";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  forbiddenOrigin,
  isSameOrigin,
  isUuid,
} from "@/lib/request-security";
import {
  enforceRateLimit,
  RateLimitError,
  rateLimitResponse,
} from "@/lib/rate-limit";

type SessionRow = {
  id: string;
  title: string;
  preview: string | null;
  created_at: string;
  updated_at: string;
};

type MessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "completed";
  created_at: string;
};

function generateTitle(messages: Message[]) {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage) return "گفتگوی جدید";
  const content = firstUserMessage.content.trim();
  return content.length > 30 ? `${content.slice(0, 30)}...` : content;
}

function sanitizeMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) {
    return null;
  }

  const messages = value.filter(
    (message): message is Message =>
      Boolean(message) &&
      typeof message === "object" &&
      isUuid(message.id) &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= 4_000 &&
      message.status === "completed" &&
      typeof message.createdAt === "string" &&
      !Number.isNaN(Date.parse(message.createdAt))
  );

  return messages.length === value.length ? messages : null;
}

async function authenticatedUser(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return null;
  await enforceRateLimit("history-user", user.id, 180, 10 * 60);
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "وارد حساب نشده‌ای" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (sessionId && !isUuid(sessionId)) {
      return NextResponse.json({ error: "شناسه گفتگو معتبر نیست" }, { status: 400 });
    }

    if (sessionId) {
      const rows = await db<MessageRow>(
        `SELECT m.id, m.role, m.content, m.status, m.created_at
         FROM messages m
         INNER JOIN chat_sessions s ON s.id = m.session_id
         WHERE m.session_id = $1
           AND s.user_id = $2
         ORDER BY m.created_at ASC`,
        [sessionId, user.id]
      );

      return NextResponse.json({
        messages: rows.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          status: message.status,
          createdAt: message.created_at,
        })),
      });
    }

    const rows = await db<SessionRow>(
      `SELECT id, title, preview, created_at, updated_at
       FROM chat_sessions
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 100`,
      [user.id]
    );
    return NextResponse.json({ sessions: rows });
  } catch (error) {
    if (error instanceof RateLimitError) return rateLimitResponse(error);
    console.error("chat-history GET error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تاریخچه گفتگو" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  try {
    const user = await authenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "وارد حساب نشده‌ای" }, { status: 401 });
    }

    const body = (await req.json()) as { sessionId?: unknown; messages?: unknown };
    const sessionId = body.sessionId;
    const messages = sanitizeMessages(body.messages);
    if (!isUuid(sessionId) || !messages) {
      return NextResponse.json({ error: "اطلاعات گفتگو معتبر نیست" }, { status: 400 });
    }

    const title = generateTitle(messages);
    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.slice(0, 50);
    const ownerRows = await db<{ id: string }>(
      `INSERT INTO chat_sessions (id, user_id, title, preview, updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (id)
       DO UPDATE SET
         title = excluded.title,
         preview = excluded.preview,
         updated_at = now()
       WHERE chat_sessions.user_id = excluded.user_id
       RETURNING id`,
      [sessionId, user.id, title, preview]
    );

    if (ownerRows.length === 0) {
      return NextResponse.json({ error: "دسترسی به گفتگو مجاز نیست" }, { status: 403 });
    }

    for (const message of messages) {
      await db(
        `INSERT INTO messages (id, session_id, role, content, status, created_at)
         VALUES ($1, $2, $3, $4, 'completed', $5)
         ON CONFLICT (id) DO NOTHING`,
        [message.id, sessionId, message.role, message.content.trim(), message.createdAt]
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        title,
        preview,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof RateLimitError) return rateLimitResponse(error);
    console.error("chat-history POST error:", error);
    return NextResponse.json({ error: "خطا در ذخیره گفتگو" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();

  try {
    const user = await authenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "وارد حساب نشده‌ای" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!isUuid(sessionId)) {
      return NextResponse.json({ error: "شناسه گفتگو معتبر نیست" }, { status: 400 });
    }

    await db("DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2", [
      sessionId,
      user.id,
    ]);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RateLimitError) return rateLimitResponse(error);
    console.error("chat-history DELETE error:", error);
    return NextResponse.json({ error: "خطا در حذف گفتگو" }, { status: 500 });
  }
}
