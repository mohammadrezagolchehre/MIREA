'use client';

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatSession } from "../../../hooks/Usechathistory";

type Props = {
  sessions: ChatSession[];
  activeChatId?: string;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
};

export default function MiraSidebar({
  sessions,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

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

      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-30 flex flex-col w-72",
          "bg-white/5 backdrop-blur-2xl border-r border-white/10",
          "transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full" dir="rtl">

          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border border-white/20 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-cyan-300" />
            </div>
            <span className="text-white/70 text-sm font-medium">میرآ</span>
          </div>

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

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {sessions.length === 0 ? (
              <p className="text-white/25 text-xs text-center mt-6">هنوز گفتگویی نداری</p>
            ) : (
              <>
                <p className="text-white/30 text-xs px-2 pb-2 pt-1">گفتگوهای اخیر</p>
                {sessions.map((session) => (
                  <div key={session.id} className="group/item relative">
                    <button
                      onClick={() => onSelectChat(session.id)}
                      className={cn(
                        "w-full text-right rounded-xl px-3 py-2.5 pr-3 pl-8 transition-all duration-150",
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

                    {/* دکمه حذف — hover نشون داده میشه */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(session.id);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2
                        opacity-0 group-hover/item:opacity-100 transition-opacity
                        text-white/30 hover:text-red-400 p-1 rounded-lg hover:bg-white/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>

        </div>
      </aside>
    </>
  );
}