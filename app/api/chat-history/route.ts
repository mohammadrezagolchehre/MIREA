import { NextRequest, NextResponse } from "next/server";
import type { Message } from "@/app/types/message";
import { db } from "@/lib/db";

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
  status: "streaming" | "completed" | "error";
  created_at: string;
};

function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((message) => message.role === "user");
  if (!firstUserMsg) return "گفتگوی جدید";

  const content = firstUserMsg.content.trim();
  return content.length > 30 ? `${content.slice(0, 30)}...` : content;
}

function getRequiredParam(req: NextRequest, key: string) {
  const value = req.nextUrl.searchParams.get(key);

  if (!value) {
    throw new Error(`${key} is required`);
  }

  return value;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getRequiredParam(req, "userId");
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (sessionId) {
      const rows = await db<MessageRow>(
        `SELECT m.id, m.role, m.content, m.status, m.created_at
         FROM messages m
         INNER JOIN chat_sessions s ON s.id = m.session_id
         WHERE m.session_id = $1
           AND s.user_id = $2
         ORDER BY m.created_at ASC`,
        [sessionId, userId]
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
       ORDER BY updated_at DESC`,
      [userId]
    );

    return NextResponse.json({ sessions: rows });
  } catch (error) {
    console.error("chat-history GET error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تاریخچه گفتگو" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId, messages } = await req.json();

    if (!userId || !sessionId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    const completedMessages = (messages as Message[]).filter(
      (message) => message.status === "completed"
    );

    if (completedMessages.length === 0) {
      return NextResponse.json({ success: true });
    }

    const title = generateTitle(completedMessages);
    const lastMessage = completedMessages[completedMessages.length - 1];
    const preview = lastMessage?.content?.slice(0, 50) ?? "";

    await db(
      `INSERT INTO chat_sessions (id, user_id, title, preview, updated_at)
       VALUES ($1, $2, $3, $4, now())
       ON CONFLICT (id)
       DO UPDATE SET
         title = excluded.title,
         preview = excluded.preview,
         updated_at = now()`,
      [sessionId, userId, title, preview]
    );

    for (const message of completedMessages) {
      await db(
        `INSERT INTO messages (id, session_id, role, content, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id)
         DO NOTHING`,
        [
          message.id,
          sessionId,
          message.role,
          message.content,
          message.status ?? "completed",
          message.createdAt,
        ]
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
    console.error("chat-history POST error:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره گفتگو" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getRequiredParam(req, "userId");
    const sessionId = getRequiredParam(req, "sessionId");

    await db("DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2", [
      sessionId,
      userId,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("chat-history DELETE error:", error);
    return NextResponse.json(
      { error: "خطا در حذف گفتگو" },
      { status: 500 }
    );
  }
}
