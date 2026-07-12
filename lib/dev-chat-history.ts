import type { Message } from "@/app/types/message";

type DevSession = {
  id: string;
  userId: string;
  title: string;
  preview: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

const globalForChatHistory = globalThis as typeof globalThis & {
  __mireaDevChatSessions?: Map<string, DevSession>;
};

function getSessionStore() {
  if (!globalForChatHistory.__mireaDevChatSessions) {
    globalForChatHistory.__mireaDevChatSessions = new Map<string, DevSession>();
  }

  return globalForChatHistory.__mireaDevChatSessions;
}

function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((message) => message.role === "user");
  if (!firstUserMsg) return "گفتگوی جدید";

  const content = firstUserMsg.content.trim();
  return content.length > 30 ? `${content.slice(0, 30)}...` : content;
}

export function listDevSessions(userId: string) {
  return Array.from(getSessionStore().values())
    .filter((session) => session.userId === userId)
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .map((session) => ({
      id: session.id,
      title: session.title,
      preview: session.preview,
      created_at: session.createdAt,
      updated_at: session.updatedAt,
    }));
}

export function loadDevSession(userId: string, sessionId: string) {
  const session = getSessionStore().get(sessionId);

  if (!session || session.userId !== userId) {
    return [];
  }

  return session.messages;
}

export function saveDevSession(userId: string, sessionId: string, messages: Message[]) {
  const completedMessages = messages.filter(
    (message) => message.status === "completed"
  );

  if (completedMessages.length === 0) {
    return null;
  }

  const existing = getSessionStore().get(sessionId);
  const existingIds = new Set(existing?.messages.map((message) => message.id));
  const mergedMessages = [
    ...(existing?.messages ?? []),
    ...completedMessages.filter((message) => !existingIds.has(message.id)),
  ];
  const now = new Date().toISOString();
  const lastMessage = mergedMessages[mergedMessages.length - 1];
  const title = generateTitle(mergedMessages);
  const preview = lastMessage?.content?.slice(0, 50) ?? "";

  getSessionStore().set(sessionId, {
    id: sessionId,
    userId,
    title,
    preview,
    messages: mergedMessages,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });

  return {
    id: sessionId,
    title,
    preview,
    updatedAt: now,
  };
}

export function deleteDevSession(userId: string, sessionId: string) {
  const session = getSessionStore().get(sessionId);

  if (session?.userId === userId) {
    getSessionStore().delete(sessionId);
  }
}
