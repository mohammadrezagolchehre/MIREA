'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import MiraSidebar from "./Mireasidebar";
import WelcomeScreen from "@/components/ui/home/WelcomeScreen";
import { Message } from "@/app/types/message";
import { AuthUser } from "../../../hooks/UseAuth";
import { useChatHistory } from "../../../hooks/Usechathistory";

type Props = {
  user: AuthUser;
};

export default function DashboardView({ user }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>(() => crypto.randomUUID());
  const [pendingMessage, setPendingMessage] = useState("");
  const { sessions, saveSession, loadSession, deleteSession } = useChatHistory();

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!activeChatId || messages.length === 0) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveSession(activeChatId, messages);
    }, 1000);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [messages, activeChatId, saveSession]);

  const handleNewChat = () => {
    if (activeChatId && messages.length > 0) {
      saveSession(activeChatId, messages);
    }
    setMessages([]);
    setActiveChatId(crypto.randomUUID());
  };

  const handleSelectChat = async (id: string) => {
    if (activeChatId && messages.length > 0) {
      saveSession(activeChatId, messages);
    }
    const loaded = await loadSession(id);
    setMessages(loaded);
    setActiveChatId(id);
  };

  const handleWelcomeSelect = useCallback((text: string) => {
    setPendingMessage(text);
  }, []);

  const handlePendingMessageSent = useCallback(() => {
    setPendingMessage("");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MiraSidebar
        sessions={sessions}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={deleteSession}
      />

      <div className="flex h-dvh flex-col">
        <DashboardHeader user={user} />

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-3 sm:px-4">
            {messages.length === 0 && (
              <WelcomeScreen
                firstName={user.firstName}
                onSelect={handleWelcomeSelect}
              />
            )}

            <div
              className={
                messages.length === 0
                  ? "shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-6"
                  : "flex min-h-0 flex-1 flex-col"
              }
            >
              <ChatContainer
                messages={messages}
                setMessages={setMessages}
                inputOnly={messages.length === 0}
                pendingMessage={pendingMessage}
                onPendingMessageSent={handlePendingMessageSent}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
