'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function DashboardHeader() {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState("محمدرضا");
  const [lastName, setLastName] = useState("گلچهره");
  const [phone] = useState("09128035645");

  // avatarText: اگه نام‌خانوادگی داشت دو حرف، وگرنه یک حرف
  const avatarText = lastName
    ? `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim()
    : `${firstName?.[0] ?? ""}`.trim();

  const handleLogout = () => {
    console.log("logout");
    // بعداً: signOut() + router.push("/auth/login")
  };

  const handleSaveProfile = () => {
    if (!firstName.trim()) {
      alert("وارد کردن نام الزامی است");
      return;
    }
    // بعداً: API call
    setIsEditing(false);
  };

  return (
   <header className="sticky top-0 z-20 flex items-center justify-end gap-3 px-5 py-4
  md:bg-transparent md:backdrop-blur-none
  bg-black/20 backdrop-blur-xl border-b border-white/5 md:border-transparent">

      {/* دکمه اشتراک */}
      <GlassButton
        variant="subscription"
        onClick={() => router.push("/pricing")}
      >
        خرید اشتراک
      </GlassButton>

      {/* منوی کاربر */}
      <GlassDropdownMenu>
        <GlassDropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 outline-none group">

            {/* فقط نام — بدون نام‌خانوادگی */}
            <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              {firstName}
            </span>

            {/* Avatar */}
            <GlassAvatar className="
              size-10 shrink-0
              flex items-center justify-center
              rounded-full
              bg-gradient-to-br from-cyan-500/40 to-blue-500/40
              border border-white/20
              text-white text-sm font-bold
              group-hover:border-white/40 transition-colors
            ">
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

      {/* دیالوگ پروفایل */}
      <GlassDialog open={profileOpen} onOpenChange={(o) => { setProfileOpen(o); if (!o) setIsEditing(false); }}>
        <GlassDialogContent className="max-w-md">

          <GlassDialogHeader className="items-center text-center">
            {/* Avatar بزرگ — dynamic */}
            <div className="relative mx-auto">
              <GlassAvatar className="
                size-20 mx-auto
                flex items-center justify-center
                rounded-full
                border-2 border-cyan-400/40
                bg-gradient-to-br from-cyan-500/30 to-blue-500/30
                text-white text-2xl font-bold
              ">
                {avatarText}
              </GlassAvatar>
              <button className="
                absolute -bottom-1 -left-1
                text-[10px] text-cyan-400 hover:text-cyan-300
                bg-white/10 border border-white/15 rounded-full
                px-1.5 py-0.5
              ">
                ویرایش
              </button>
            </div>

            <GlassDialogTitle className="mt-4 text-white">
              {firstName} {lastName}
            </GlassDialogTitle>
          </GlassDialogHeader>

          <div dir="rtl" className="space-y-3 mt-5">

            {/* نام */}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">نام</p>
              {isEditing ? (
                <GlassInput
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="text-white w-full"
                />
              ) : (
                <p className="text-white text-sm">{firstName}</p>
              )}
            </div>

            {/* نام‌خانوادگی */}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">نام خانوادگی</p>
              {isEditing ? (
                <GlassInput
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="text-white w-full"
                  placeholder="اختیاری"
                />
              ) : (
                <p className="text-white text-sm">{lastName || "—"}</p>
              )}
            </div>

            {/* شماره تلفن — غیرقابل ویرایش */}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">شماره تلفن</p>
              <p className="text-white text-sm">{phone}</p>
            </div>

            {/* پلن */}
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-white/40 text-[11px] mb-1">اشتراک</p>
              <p className="text-cyan-400 text-sm font-medium">رایگان</p>
            </div>

          </div>

          <GlassDialogFooter className="mt-5">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <GlassButton variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>
                  انصراف
                </GlassButton>
                <GlassButton variant="primary" className="flex-1" onClick={handleSaveProfile}>
                  ذخیره
                </GlassButton>
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