'use client';

import { useState } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import {
  GlassDropdownMenu,
  GlassDropdownMenuTrigger,
  GlassDropdownMenuContent,
} from "@/components/glass-dropdown-menu";
import { GlassInput } from "@/components/ui/glass-input";
import { useAuth } from "../../../hooks/UseAuth";

type Step = "phone" | "otp" | "name";

export default function GuestHeader() {
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const startTimer = () => {
    setTimer(120);
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setTimerActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    // Mock: بعداً API call
    setStep("otp");
    startTimer();
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length < 5) return;
    // Mock: بعداً از API میفهمیم کاربر جدیده یا نه
    const isNewUser = true;
    if (isNewUser) {
      setStep("name");
    } else {
      // کاربر قدیمی — مستقیم لاگین
      login({ phone, firstName: "کاربر" }); // بعداً اسم از API میاد
      setOpen(false);
      resetForm();
    }
  };

  const handleFinish = () => {
    if (!firstName.trim()) return;
    login({ phone, firstName: firstName.trim() });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStep("phone");
    setPhone("");
    setOtp(["", "", "", "", ""]);
    setFirstName("");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end gap-3 px-5 py-4
      md:bg-transparent md:backdrop-blur-none
      bg-black/20 backdrop-blur-xl border-b border-white/5 md:border-transparent">

      <GlassButton variant="subscription">
        خرید اشتراک
      </GlassButton>

      <GlassDropdownMenu open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
        <GlassDropdownMenuTrigger asChild>
          <GlassButton variant="primary" glowEffect>
            ورود / ثبت‌نام
          </GlassButton>
        </GlassDropdownMenuTrigger>

        <GlassDropdownMenuContent align="end" className="w-80 p-5">
          <div dir="rtl" className="space-y-4">

            {step === "phone" && (
              <>
                <div className="space-y-1">
                  <p className="text-white font-medium text-sm">ورود / ثبت‌نام</p>
                  <p className="text-white/40 text-xs">شماره موبایلت رو وارد کن</p>
                </div>
                <GlassInput
                  type="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-right"
                  maxLength={11}
                />
                <GlassButton
                  variant="primary"
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={phone.length < 10}
                >
                  ارسال کد تأیید
                </GlassButton>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="space-y-1">
                  <p className="text-white font-medium text-sm">کد تأیید</p>
                  <p className="text-white/40 text-xs">کد ۵ رقمی ارسال شده به {phone}</p>
                </div>
                <div dir="ltr" className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-11 h-12 text-center text-white text-lg font-bold
                        bg-white/10 border border-white/20 rounded-xl
                        focus:outline-none focus:border-cyan-400/60 focus:bg-white/15
                        transition-all"
                    />
                  ))}
                </div>
                <div className="text-center">
                  {timerActive ? (
                    <span className="text-white/40 text-xs">ارسال مجدد تا {formatTimer(timer)}</span>
                  ) : (
                    <button onClick={handleSendOtp} className="text-cyan-400 text-xs hover:text-cyan-300">
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
                <GlassButton
                  variant="primary"
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length < 5}
                >
                  تأیید
                </GlassButton>
                <button onClick={() => setStep("phone")} className="w-full text-center text-white/40 text-xs hover:text-white/60">
                  ← تغییر شماره
                </button>
              </>
            )}

            {step === "name" && (
              <>
                <div className="space-y-1">
                  <p className="text-white font-medium text-sm">خوش اومدی!</p>
                  <p className="text-white/40 text-xs">اسمت رو بهم بگو</p>
                </div>
                <GlassInput
                  placeholder="مثلاً: محمدرضا"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-right"
                />
                <GlassButton
                  variant="primary"
                  className="w-full"
                  onClick={handleFinish}
                  disabled={!firstName.trim()}
                >
                  شروع کن
                </GlassButton>
              </>
            )}

          </div>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>

    </header>
  );
}