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
import { useRouter } from "next/navigation";

type Props = {
  user: AuthUser;
};

export default function DashboardHeader({ user }: Props) {
  const { logout, updateProfile } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName ?? "");

  const avatarText = lastName
    ? `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim()
    : `${firstName?.[0] ?? ""}`.trim();

  const handleLogout = () => {
    logout();
    // page.tsx خودش GuestView نشون میده
  };

  const handleSaveProfile = () => {
    if (!firstName.trim()) return;
    updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() || undefined });
    setIsEditing(false);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end gap-2 border-b border-white/10 bg-black/20 px-3 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:gap-3 sm:px-5 sm:py-4 md:border-white/5 md:bg-white/5">

      <GlassButton variant="subscription" className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm" onClick={() => router.push("/pricing")}>
        خرید اشتراک
      </GlassButton>

      <GlassDropdownMenu>
        <GlassDropdownMenuTrigger asChild>
          <button className="group flex items-center gap-2 outline-none">
            <motion.span
              key={firstName}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-24 truncate text-sm font-medium text-white/80 transition-colors group-hover:text-white/90"
            >
              {firstName}
            </motion.span>
            <motion.div
              whileHover={{ scale: 1.06, rotate: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <GlassAvatar className="size-9 sm:size-10 shrink-0 flex items-center justify-center rounded-full
              bg-gradient-to-br from-cyan-500/40 to-blue-500/40 border border-white/20
              text-white/90 text-sm font-bold group-hover:border-white/40 transition-colors">
                {avatarText}
              </GlassAvatar>
            </motion.div>
          </button>
        </GlassDropdownMenuTrigger>

        <GlassDropdownMenuContent align="end">
          <GlassDropdownMenuItem dir="rtl" onClick={() => setProfileOpen(true)}>
            پروفایل
          </GlassDropdownMenuItem>
          <GlassDropdownMenuItem dir="rtl" onClick={handleLogout} className="text-red-400">
            خروج
          </GlassDropdownMenuItem>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>

      <GlassDialog open={profileOpen} onOpenChange={(o) => { setProfileOpen(o); if (!o) setIsEditing(false); }}>
        <GlassDialogContent className="max-w-md">
          <GlassDialogHeader className="items-center text-center">
            <div className="relative mx-auto">
            <GlassAvatar className="size-20 mx-auto flex items-center justify-center rounded-full
                border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-500/30 to-blue-500/30
                text-white/90 text-2xl font-bold">
                {avatarText}
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
                <GlassButton variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>انصراف</GlassButton>
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
