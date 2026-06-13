'use client';

import { useState, useEffect } from "react";
import { Message } from "@/app/types/message";
import { supabase } from "@/lib/supabase";

export type ChatSession = {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
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

function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg) return "گفتگوی جدید";
  const content = firstUserMsg.content.trim();
  return content.length > 30 ? content.slice(0, 30) + "..." : content;
}

export function useChatHistory(userId?: string) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  // لود session ها از Supabase
  useEffect(() => {
    if (!userId) return;
    loadSessions();
  }, [userId]);

  const loadSessions = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const formatted: ChatSession[] = (data ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        preview: s.preview ?? "",
        date: formatDate(s.updated_at),
        messages: [],
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));

      setSessions(formatted);
    } catch (err) {
      console.error("loadSessions error:", err);
    } finally {
      setLoading(false);
    }
  };

  // لود پیام‌های یه session
  const loadSession = async (sessionId: string): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        status: m.status,
        createdAt: m.created_at,
      }));
    } catch (err) {
      console.error("loadSession error:", err);
      return [];
    }
  };

  // ذخیره یا آپدیت session
  const saveSession = async (sessionId: string, messages: Message[]) => {
    if (!userId || messages.length === 0) return;

    const title = generateTitle(messages);
    const lastMsg = messages[messages.length - 1];
    const preview = lastMsg?.content?.slice(0, 50) ?? "";

    try {
      // upsert session
      const { error: sessionError } = await supabase
        .from("chat_sessions")
        .upsert({
          id: sessionId,
          user_id: userId,
          title,
          preview,
          updated_at: new Date().toISOString(),
        });

      if (sessionError) throw sessionError;

      // پیام‌های جدید رو پیدا کن و ذخیره کن
      const { data: existing } = await supabase
        .from("messages")
        .select("id")
        .eq("session_id", sessionId);

      const existingIds = new Set((existing ?? []).map((m) => m.id));
      const newMessages = messages.filter(
        (m) => !existingIds.has(m.id) && m.status === "completed"
      );

      if (newMessages.length > 0) {
        const { error: msgError } = await supabase.from("messages").insert(
          newMessages.map((m) => ({
            id: m.id,
            session_id: sessionId,
            role: m.role,
            content: m.content,
            status: m.status,
            created_at: m.createdAt,
          }))
        );
        if (msgError) throw msgError;
      }

      // آپدیت local state
      setSessions((prev) => {
        const exists = prev.find((s) => s.id === sessionId);
        const now = new Date().toISOString();
        if (exists) {
          return prev.map((s) =>
            s.id === sessionId
              ? { ...s, title, preview, date: formatDate(now), updatedAt: now }
              : s
          );
        } else {
          return [
            {
              id: sessionId,
              title,
              preview,
              date: "امروز",
              messages: [],
              createdAt: now,
              updatedAt: now,
            },
            ...prev,
          ];
        }
      });
    } catch (err) {
      console.error("saveSession error:", err);
    }
  };

  // حذف session
  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error("deleteSession error:", err);
    }
  };

  return { sessions, loading, saveSession, loadSession, deleteSession };
}