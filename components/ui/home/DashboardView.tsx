'use client';

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import MiraSidebar, { ChatSession } from "./Mireasidebar";
import WelcomeScreen from "@/components/ui/home/WelcomeScreen";
import { Message } from "@/app/types/message";
import { AuthUser } from "../../../hooks/UseAuth";

type Props = {
  user: AuthUser;
};

const MOCK_SESSIONS: ChatSession[] = [
  { id: "1", title: "درباره اضطراب امتحان", preview: "حالم خوب نیست، خیلی استرس...", date: "امروز" },
  { id: "2", title: "رابطه با مادرم", preview: "میخوام درباره رابطه‌م صحبت کنم...", date: "دیروز" },
  { id: "3", title: "احساس تنهایی", preview: "ذهنم شلوغه و نمیتونم...", date: "۳ روز پیش" },
  { id: "4", title: "رشد شخصی", preview: "کمکم کن رشد کنم...", date: "هفته پیش" },
];

export default function DashboardView({ user }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();

  return (
    <div className="relative min-h-screen">
      <MiraSidebar
        sessions={MOCK_SESSIONS}
        activeChatId={activeChatId}
        onNewChat={() => { setMessages([]); setActiveChatId(undefined); }}
        onSelectChat={(id) => { setActiveChatId(id); setMessages([]); }}
      />

      <div className="flex flex-col h-dvh">
        {/* user رو پاس میدیم تا DashboardHeader اسم واقعی نشون بده */}
        <DashboardHeader user={user} />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="max-w-3xl mx-auto w-full h-full flex flex-col px-4">
            {messages.length === 0 ? (
              <>
                <WelcomeScreen
                  firstName={user.firstName}
                  onSelect={(text) => {
                    setMessages([{
                      id: crypto.randomUUID(),
                      role: "user",
                      content: text,
                      createdAt: new Date().toISOString(),
                      status: "completed",
                    }]);
                  }}
                />
                <div className="pb-6">
                  <ChatContainer messages={messages} setMessages={setMessages} inputOnly />
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