'use client';

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import ChatContainer from "@/components/ui/Liora/ChatContainer";
import MiraSidebar, { ChatSession } from "@/components/ui/home/Mireasidebar";
import WelcomeScreen from "@/components/ui/home/WelcomeScreen";
import { Message } from "@/app/types/message";
import { text } from "stream/consumers";

const MOCK_USER = { firstName: "محمدرضا" };

const MOCK_SESSIONS: ChatSession[] = [
  { id: "1", title: "درباره اضطراب امتحان", preview: "حالم خوب نیست، خیلی استرس...", date: "امروز" },
  { id: "2", title: "رابطه با مادرم", preview: "میخوام درباره رابطه‌م صحبت کنم...", date: "دیروز" },
  { id: "3", title: "احساس تنهایی", preview: "ذهنم شلوغه و نمیتونم...", date: "۳ روز پیش" },
  { id: "4", title: "رشد شخصی", preview: "کمکم کن رشد کنم...", date: "هفته پیش" },
];

export default function DashboardView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(undefined);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setMessages([]);
  };

  return (
    // بدون dir روی wrapper — هر کامپوننت dir خودش رو داره
    <div className="relative min-h-screen">

      {/* Sidebar — overlay، فضا نمیگیره */}
      <MiraSidebar
        sessions={MOCK_SESSIONS}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main — همیشه full width و وسط‌چین */}
      <div className="flex flex-col h-dvh">
        <DashboardHeader />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="max-w-3xl mx-auto w-full h-full flex flex-col px-4">

        {messages.length === 0 ? (
          <>
            {/* WelcomeScreen وسط صفحه */}
            <div className="flex-1 flex items-center justify-center">
              <WelcomeScreen
                firstName={MOCK_USER.firstName}
                onSelect={(text) => {
                  const msg: Message = {
                    id: crypto.randomUUID(),
                    role: "user",
                    content: text,
                    createdAt: new Date().toISOString(),
                    status: "completed",
                  };
                  setMessages([msg]);
                }}
              />
            </div>

            {/* Input ثابت پایین */}
            <div className="pb-6">
              <ChatContainer
                messages={messages}
                setMessages={setMessages}
                inputOnly
              />
            </div>
          </>
        ) : (
          <ChatContainer
            messages={messages}
            setMessages={setMessages}
          />
        )}
          </div>
        </main>
      </div>
    </div>
  );
}