'use client';

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Plus, Sparkles, Trash2, X } from "lucide-react";
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
  const [open, setOpen] = useState<boolean | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const isOpen = open ?? false;

  const groupedSessions = groupSessionsByDate(sessions);

  const handleDelete = (id: string) => {
    onDeleteChat(id);
    setConfirmingDeleteId(null);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <button
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "fixed top-4 z-40 transition-all duration-300 sm:top-6",
          "h-9 w-9 md:h-7 md:w-7 rounded-full",
          "bg-white/10 backdrop-blur-xl border border-white/20",
          "flex items-center justify-center",
          "text-white/60 hover:text-white/85 transition-colors shadow-lg",
          isOpen ? "left-[17rem] md:left-[17.5rem]" : "left-3"
        )}
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-dvh z-30 flex flex-col w-[min(18rem,calc(100vw-3.5rem))] md:w-72",
          "bg-white/[0.07] backdrop-blur-2xl border-r border-white/10 shadow-[18px_0_48px_rgba(0,0,0,0.18)]",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
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
                text-white/80 hover:text-white/90 text-sm transition-all duration-300"
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
                {groupedSessions.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <p className="px-2 pb-1 pt-3 text-xs text-white/30 first:pt-1">{group.label}</p>
                    {group.items.map((session) => (
                      <div key={session.id} className="group/item relative">
                        <button
                          onClick={() => onSelectChat(session.id)}
                          className={cn(
                            "w-full rounded-xl px-3 py-2.5 pr-3 pl-9 text-right transition-all duration-300",
                            activeChatId === session.id
                              ? "bg-white/14 border border-white/20 text-white/[0.88] shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
                              : "border border-transparent text-white/65 hover:bg-white/8 hover:text-white/[0.88] hover:border-white/10"
                          )}
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex min-w-0 items-center justify-between gap-2">
                              <span className="shrink-0 text-[10px] text-white/30">{session.date}</span>
                              <p className="min-w-0 truncate text-xs font-medium leading-snug">{session.title}</p>
                            </div>
                            <p className="truncate text-right text-[11px] leading-snug text-white/40">
                              {session.preview}
                            </p>
                          </div>
                        </button>

                        {confirmingDeleteId === session.id ? (
                          <div
                            className="absolute left-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-white/10 bg-black/35 p-1 backdrop-blur-xl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              aria-label="تأیید حذف"
                              onClick={() => handleDelete(session.id)}
                              className="rounded-md p-1 text-red-400 transition hover:bg-red-400/10"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              aria-label="لغو حذف"
                              onClick={() => setConfirmingDeleteId(null)}
                              className="rounded-md p-1 text-white/45 transition hover:bg-white/10 hover:text-white/80"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <button
                            aria-label="حذف گفتگو"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmingDeleteId(session.id);
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2
                              rounded-lg p-1 text-white/30 opacity-100 transition-all duration-200
                              hover:bg-white/10 hover:text-red-400 md:opacity-0 group-hover/item:opacity-100"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
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

function getDateGroup(dateLabel: string) {
  if (dateLabel === "امروز") return "امروز";
  if (dateLabel === "دیروز") return "دیروز";
  if (dateLabel.includes("روز پیش") || dateLabel.includes("هفته پیش")) return "هفته پیش";
  return "قدیمی‌تر";
}

function groupSessionsByDate(sessions: ChatSession[]) {
  const order = ["امروز", "دیروز", "هفته پیش", "قدیمی‌تر"];
  const groups = sessions.reduce<Record<string, ChatSession[]>>((acc, session) => {
    const label = getDateGroup(session.date);
    acc[label] = [...(acc[label] ?? []), session];
    return acc;
  }, {});

  return order
    .filter((label) => groups[label]?.length)
    .map((label) => ({ label, items: groups[label] }));
}
