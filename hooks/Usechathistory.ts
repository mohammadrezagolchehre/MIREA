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
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return data as T;
}

export function useChatHistory(userId?: string) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/chat-history?userId=${encodeURIComponent(userId)}`
      );
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
    } catch (err) {
      console.error("loadSessions error:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const loadSession = async (sessionId: string): Promise<Message[]> => {
    if (!userId) return [];

    try {
      const params = new URLSearchParams({ userId, sessionId });
      const response = await fetch(`/api/chat-history?${params.toString()}`);
      const data = await readJson<{ messages: Message[] }>(response);
      return data.messages;
    } catch (err) {
      console.error("loadSession error:", err);
      return [];
    }
  };

  const saveSession = async (sessionId: string, messages: Message[]) => {
    if (!userId || messages.length === 0) return;

    try {
      const response = await fetch("/api/chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, sessionId, messages }),
      });
      const data = await readJson<{
        session?: {
          id: string;
          title: string;
          preview: string;
          updatedAt: string;
        };
      }>(response);

      const savedSession = data.session;
      if (!savedSession) return;

      setSessions((prev) => {
        const exists = prev.find((session) => session.id === sessionId);

        if (exists) {
          return prev.map((session) =>
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
          ...prev,
        ];
      });
    } catch (err) {
      console.error("saveSession error:", err);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!userId) return;

    try {
      const params = new URLSearchParams({ userId, sessionId });
      const response = await fetch(`/api/chat-history?${params.toString()}`, {
        method: "DELETE",
      });

      await readJson<{ success: boolean }>(response);
      setSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
    } catch (err) {
      console.error("deleteSession error:", err);
    }
  };

  return { sessions, loading, saveSession, loadSession, deleteSession };
}
