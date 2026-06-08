'use client';

import { useState } from "react";
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
    <header className="sticky top-0 z-20 flex items-center justify-end gap-3 px-5 py-4
      md:bg-transparent md:backdrop-blur-none
      bg-black/20 backdrop-blur-xl border-b border-white/5 md:border-transparent">

      <GlassButton variant="subscription" onClick={() => router.push("/pricing")}>
        خرید اشتراک
      </GlassButton>

      <GlassDropdownMenu>
        <GlassDropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 outline-none group">
            <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              {firstName}
            </span>
            <GlassAvatar className="size-10 shrink-0 flex items-center justify-center rounded-full
              bg-gradient-to-br from-cyan-500/40 to-blue-500/40 border border-white/20
              text-white text-sm font-bold group-hover:border-white/40 transition-colors">
              {avatarText}
            </GlassAvatar>
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
                text-white text-2xl font-bold">
                {avatarText}
              </GlassAvatar>
            </div>
            <GlassDialogTitle className="mt-4 text-white">
              {firstName} {lastName}
            </GlassDialogTitle>
          </GlassDialogHeader>

          <div dir="rtl" className="space-y-3 mt-5">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">نام</p>
              {isEditing ? (
                <GlassInput value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-white w-full" />
              ) : (
                <p className="text-white text-sm">{firstName}</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">نام خانوادگی</p>
              {isEditing ? (
                <GlassInput value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-white w-full" placeholder="اختیاری" />
              ) : (
                <p className="text-white text-sm">{lastName || "—"}</p>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">شماره تلفن</p>
              <p className="text-white text-sm">{user.phone}</p>
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