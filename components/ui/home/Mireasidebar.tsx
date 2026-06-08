'use client';

import { useState } from "react";
import { Plus, MessageCircle, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatSession = {
  id: string;
  title: string;
  preview: string;
  date: string;
};

type Props = {
  sessions: ChatSession[];
  activeChatId?: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
};

const mockSessions: ChatSession[] = [
  { id: "1", title: "درباره اضطراب امتحان", preview: "حالم خوب نیست، خیلی استرس...", date: "امروز" },
  { id: "2", title: "رابطه با مادرم", preview: "میخوام درباره رابطه‌م صحبت کنم...", date: "دیروز" },
  { id: "3", title: "احساس تنهایی", preview: "ذهنم شلوغه و نمیتونم...", date: "۳ روز پیش" },
  { id: "4", title: "رشد شخصی", preview: "کمکم کن رشد کنم...", date: "هفته پیش" },
];

export default function MiraSidebar({
  sessions = mockSessions,
  activeChatId,
  onNewChat,
  onSelectChat,
}: Props) {
  // پیش‌فرض بسته
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Overlay موبایل */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* دکمه toggle — همیشه visible، خارج از aside */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed top-8 z-40 transition-all duration-300",
          "h-7 w-7 rounded-full",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "flex items-center justify-center",
          "text-white/60 hover:text-white transition-colors shadow-lg",
          open ? "left-[17.5rem]" : "left-3"
        )}
      >
        {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-30 flex flex-col w-72",
          "bg-white/5 backdrop-blur-2xl border-r border-white/10",
          "transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full" dir="rtl">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border border-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-cyan-300" />
            </div>
            <span className="text-white/70 text-sm font-medium">میرآ</span>
          </div>

          {/* New Chat */}
          <div className="px-3 py-3">
            <button
              onClick={onNewChat}
              className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5
                bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/25
                text-white/80 hover:text-white text-sm transition-all duration-200"
            >
              <Plus size={15} className="shrink-0" />
              <span>گفتگوی جدید</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            <p className="text-white/30 text-xs px-2 pb-2 pt-1">گفتگوهای اخیر</p>

            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={cn(
                  "w-full text-right rounded-xl px-3 py-2.5 transition-all duration-150",
                  activeChatId === session.id
                    ? "bg-white/14 border border-white/20 text-white"
                    : "hover:bg-white/8 border border-transparent text-white/65 hover:text-white/90"
                )}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white/30 text-[10px] shrink-0">{session.date}</span>
                    <p className="text-xs truncate font-medium leading-snug">{session.title}</p>
                  </div>
                  <p className="text-[11px] text-white/40 truncate leading-snug text-right">
                    {session.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>

        </div>
      </aside>
    </>
  );
}   