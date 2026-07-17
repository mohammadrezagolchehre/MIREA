'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassAvatar } from "../glass-avatar";
import { GlassInput } from "@/components/ui/glass-input";
import {
  GlassDialog,
  GlassDialogContent,
  GlassDialogHeader,
  GlassDialogFooter,
  GlassDialogTitle,
} from "../glass-dialog";
import {
  GlassDropdownMenu,
  GlassDropdownMenuTrigger,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
} from "@/components/glass-dropdown-menu";
import { useAuth, AuthUser } from "../../../hooks/UseAuth";
import MiraBrand from "./MiraBrand";

type Props = {
  user: AuthUser;
};

export default function DashboardHeader({ user }: Props) {
  const { logout, updateProfile } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [birthDate, setBirthDate] = useState(user.birthDate ?? "");

  const avatarText = lastName
    ? `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim()
    : `${firstName?.[0] ?? ""}`.trim();

  const handleLogout = async () => {
    await logout();
  };

  const resetProfileDraft = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName ?? "");
    setBirthDate(user.birthDate ?? "");
  };

  const handleSaveProfile = async () => {
    const nextFirstName = firstName.trim();
    const nextLastName = lastName.trim();
    if (!nextFirstName) return;

    const updatedUser = await updateProfile({
      firstName: nextFirstName,
      lastName: nextLastName || undefined,
      birthDate: birthDate || undefined,
    });
    setFirstName(updatedUser.firstName);
    setLastName(updatedUser.lastName ?? "");
    setBirthDate(updatedUser.birthDate ?? "");
    setIsEditing(false);
  };

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-black/20 px-3 py-4 backdrop-blur-xl sm:px-5 md:border-transparent md:bg-transparent md:backdrop-blur-none"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <MiraBrand />

        <GlassDropdownMenu>
          <GlassDropdownMenuTrigger asChild>
            <button className="group flex h-10 min-w-0 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-2.5 text-white/80 shadow-[0_6px_20px_rgba(124,140,255,0.16)] outline-none backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12] hover:text-white/90">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <GlassAvatar
                  glowEffect={false}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full
                  border border-white/20 bg-gradient-to-br from-cyan-500/35 to-blue-500/35
                  text-xs font-bold text-white/90 transition-colors group-hover:border-cyan-200/40"
                >
                  {avatarText || "م"}
                </GlassAvatar>
              </motion.div>
              <motion.span
                key={firstName}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-20 truncate text-sm font-medium sm:max-w-28"
              >
                {firstName}
              </motion.span>
            </button>
          </GlassDropdownMenuTrigger>

          <GlassDropdownMenuContent align="start">
            <GlassDropdownMenuItem dir="rtl" onClick={() => setProfileOpen(true)}>
              پروفایل
            </GlassDropdownMenuItem>
            <GlassDropdownMenuItem dir="rtl" onClick={handleLogout} className="text-red-400">
              خروج
            </GlassDropdownMenuItem>
          </GlassDropdownMenuContent>
        </GlassDropdownMenu>
      </div>

      {/* <GlassButton
        variant="subscription"
        className="h-10 shrink-0 px-3 text-xs sm:px-4 sm:text-sm"
        onClick={() => router.push("/pricing")}
      >
        خرید اشتراک
      </GlassButton> */}

      <GlassDialog open={profileOpen} onOpenChange={(o) => { setProfileOpen(o); if (!o) { setIsEditing(false); resetProfileDraft(); } }}>
        <GlassDialogContent className="max-w-md">
          <GlassDialogHeader className="items-center text-center">
            <div className="relative mx-auto">
              <GlassAvatar className="size-20 mx-auto flex items-center justify-center rounded-full
                border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-500/30 to-blue-500/30
                text-white/90 text-2xl font-bold">
                {avatarText || "م"}
              </GlassAvatar>
            </div>
            <GlassDialogTitle className="mt-4 text-white/90">
              {firstName} {lastName}
            </GlassDialogTitle>
          </GlassDialogHeader>

          <div dir="rtl" className="space-y-3 mt-5">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">نام</p>
              {isEditing ? (
                <GlassInput value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full text-white/90" />
              ) : (
                <p className="text-sm text-white/85">{firstName}</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">نام خانوادگی</p>
              {isEditing ? (
                <GlassInput value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full text-white/90" placeholder="اختیاری" />
              ) : (
                <p className="text-sm text-white/85">{lastName || "—"}</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">تاریخ تولد</p>
              {isEditing ? (
                <GlassInput type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full text-white/90" />
              ) : (
                <p className="text-sm text-white/85">{birthDate || "—"}</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">شماره تلفن</p>
              <p className="text-sm text-white/85">{user.phone}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">اشتراک</p>
              <p className="text-cyan-400 text-sm font-medium">رایگان</p>
            </div>
          </div>

          <GlassDialogFooter className="mt-5">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <GlassButton variant="ghost" className="flex-1" onClick={() => { resetProfileDraft(); setIsEditing(false); }}>انصراف</GlassButton>
                <GlassButton variant="primary" className="flex-1" onClick={handleSaveProfile}>ذخیره</GlassButton>
              </div>
            ) : (
              <GlassButton variant="subscription" className="w-full" onClick={() => setIsEditing(true)}>
                ویرایش پروفایل
              </GlassButton>
            )}
          </GlassDialogFooter>
        </GlassDialogContent>
      </GlassDialog>

    </header>
  );
}
