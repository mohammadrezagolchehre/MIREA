'use client';

import { useState, useEffect, useRef } from "react";
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
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [pendingMessage, setPendingMessage] = useState("");
  const { sessions, saveSession, loadSession, deleteSession } = useChatHistory(user.id);

  const saveTimer = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!activeChatId || messages.length === 0) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveSession(activeChatId, messages);
    }, 1000);
    return () => clearTimeout(saveTimer.current);
  }, [messages, activeChatId]);

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

  useEffect(() => {
    if (!activeChatId) {
      setActiveChatId(crypto.randomUUID());
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      <MiraSidebar
        sessions={sessions}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={deleteSession}
      />

      <div className="flex flex-col h-dvh">
        <DashboardHeader user={user} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="max-w-3xl mx-auto w-full h-full flex flex-col px-4">
            {messages.length === 0 ? (
              <>
                <WelcomeScreen
                  firstName={user.firstName}
                  onSelect={(text) => setPendingMessage(text)}
                />
                <div className="pb-6">
                  <ChatContainer
                    messages={messages}
                    setMessages={setMessages}
                    inputOnly
                    pendingMessage={pendingMessage}
                    onPendingMessageSent={() => setPendingMessage("")}
                  />
                </div>
              </>
            ) : (
              <ChatContainer messages={messages} setMessages={setMessages} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}