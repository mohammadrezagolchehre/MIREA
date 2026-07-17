'use client';

import { useCallback, useEffect, useState } from "react";
import { Message } from "@/app/types/message";

export type ChatSession = {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

type SessionResponse = {
  id: string;
  title: string;
  preview: string | null;
  created_at: string;
  updated_at: string;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "امروز";
  if (days === 1) return "دیروز";
  if (days < 7) return `${days} روز پیش`;
  if (days < 30) return `${Math.floor(days / 7)} هفته پیش`;
  return `${Math.floor(days / 30)} ماه پیش`;
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error ?? "Request failed");
  return data as T;
}

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat-history", { cache: "no-store" });
      const data = await readJson<{ sessions: SessionResponse[] }>(response);
      setSessions(
        data.sessions.map((session) => ({
          id: session.id,
          title: session.title,
          preview: session.preview ?? "",
          date: formatDate(session.updated_at),
          messages: [],
          createdAt: session.created_at,
          updatedAt: session.updated_at,
        }))
      );
    } catch (error) {
      console.error("loadSessions error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const loadSession = useCallback(async (sessionId: string): Promise<Message[]> => {
    try {
      const response = await fetch(
        `/api/chat-history?sessionId=${encodeURIComponent(sessionId)}`,
        { cache: "no-store" }
      );
      const data = await readJson<{ messages: Message[] }>(response);
      return data.messages;
    } catch (error) {
      console.error("loadSession error:", error);
      return [];
    }
  }, []);

  const saveSession = useCallback(async (sessionId: string, messages: Message[]) => {
    if (messages.length === 0) return;

    try {
      const response = await fetch("/api/chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messages }),
      });
      const data = await readJson<{
        session?: { id: string; title: string; preview: string; updatedAt: string };
      }>(response);
      const savedSession = data.session;
      if (!savedSession) return;

      setSessions((previous) => {
        const exists = previous.some((session) => session.id === sessionId);
        if (exists) {
          return previous.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  title: savedSession.title,
                  preview: savedSession.preview,
                  date: formatDate(savedSession.updatedAt),
                  updatedAt: savedSession.updatedAt,
                }
              : session
          );
        }

        return [
          {
            id: sessionId,
            title: savedSession.title,
            preview: savedSession.preview,
            date: "امروز",
            messages: [],
            createdAt: savedSession.updatedAt,
            updatedAt: savedSession.updatedAt,
          },
          ...previous,
        ];
      });
    } catch (error) {
      console.error("saveSession error:", error);
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(
        `/api/chat-history?sessionId=${encodeURIComponent(sessionId)}`,
        { method: "DELETE" }
      );
      await readJson<{ success: boolean }>(response);
      setSessions((previous) =>
        previous.filter((session) => session.id !== sessionId)
      );
    } catch (error) {
      console.error("deleteSession error:", error);
    }
  }, []);

  return { sessions, loading, saveSession, loadSession, deleteSession };
}
