'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import {
  GlassDropdownMenu,
  GlassDropdownMenuTrigger,
  GlassDropdownMenuContent,
} from "@/components/glass-dropdown-menu";
import {
  GlassDialog,
  GlassDialogContent,
  GlassDialogHeader,
  GlassDialogTitle,
  GlassDialogDescription,
} from "@/components/ui/glass-dialog";
import { GlassInput } from "@/components/ui/glass-input";
import { useAuth } from "../../../hooks/UseAuth";
import MiraBrand from "./MiraBrand";

type Step = "phone" | "otp";

const steps: Step[] = ["phone", "otp"];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : undefined;

export default function GuestHeader() {
  const { login } = useAuth();

  const [step, setStep] = useState<Step>("phone");
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [otpShakeKey, setOtpShakeKey] = useState(0);

  const stepIndex = steps.indexOf(step);

  const startTimer = () => {
    setTimer(120);
    setTimerActive(true);
    const interval = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setTimerActive(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const resetForm = () => {
    setStep("phone");
    setPhone("");
    setOtp(["", "", "", "", ""]);
    setFirstName("");
    setLastName("");
    setBirthDate("");
    setError("");
    setProfileError("");
  };

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("otp");
      startTimer();
    } catch (err: unknown) {
      setError(getErrorMessage(err) ?? "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 5) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.isNewUser) {
        setOpen(false);
        setProfileOpen(true);
      } else {
        login(data.user);
        setOpen(false);
        resetForm();
      }
    } catch (err: unknown) {
      setOtpShakeKey((key) => key + 1);
      setError(getErrorMessage(err) ?? "کد اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!firstName.trim()) {
      setProfileError("نام را وارد کن");
      return;
    }

    if (!birthDate) {
      setProfileError("تاریخ تولد را وارد کن");
      return;
    }

    setLoading(true);
    setProfileError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          birthDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      login(data.user);
      setProfileOpen(false);
      resetForm();
    } catch (err: unknown) {
      setProfileError(getErrorMessage(err) ?? "خطا در تکمیل پروفایل");
    } finally {
      setLoading(false);
    }
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
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 py-4
      bg-black/20 backdrop-blur-xl border-b border-white/5 md:bg-transparent md:backdrop-blur-none md:border-transparent">

      <MiraBrand />

      <GlassDropdownMenu open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !profileOpen) resetForm();
      }}>
        <GlassDropdownMenuTrigger asChild>
          <GlassButton variant="primary" glowEffect>
            ورود / ثبت نام
          </GlassButton>
        </GlassDropdownMenuTrigger>

        <GlassDropdownMenuContent align="end" className="w-80 p-5">
          <div dir="rtl" className="space-y-4">
            <div className="flex items-center gap-2" aria-label="مراحل ورود">
              {steps.map((item, index) => (
                <div
                  key={item}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index <= stepIndex ? "bg-cyan-400/70" : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}

            <AnimatePresence mode="wait">
              {step === "phone" && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/90">ورود / ثبت نام</p>
                    <p className="text-white/40 text-xs">شماره موبایلت را وارد کن</p>
                  </div>
                  <GlassInput
                    type="tel"
                    placeholder="09123456789"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full text-right"
                    maxLength={11}
                  />
                  <GlassButton
                    variant="primary"
                    className="w-full"
                    onClick={handleSendOtp}
                    disabled={phone.length < 10 || loading}
                  >
                    {loading ? "در حال ارسال..." : "ارسال کد تایید"}
                  </GlassButton>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/90">کد تایید</p>
                    <p className="text-white/40 text-xs">کد 5 رقمی ارسال شده به {phone}</p>
                  </div>
                  <motion.div
                    key={otpShakeKey}
                    dir="ltr"
                    className="flex justify-center gap-2"
                    animate={otpShakeKey ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleOtpChange(index, event.target.value)}
                        className="w-11 h-12 text-center text-white/90 text-lg font-bold
                          bg-white/10 border border-white/20 rounded-xl
                          focus:outline-none focus:border-cyan-400/60 focus:bg-white/15
                          transition-all"
                      />
                    ))}
                  </motion.div>
                  <div className="text-center">
                    {timerActive ? (
                      <span className="text-white/40 text-xs">
                        ارسال مجدد تا {formatTimer(timer)}
                      </span>
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
                    disabled={otp.join("").length < 5 || loading}
                  >
                    {loading ? "در حال بررسی..." : "تایید"}
                  </GlassButton>
                  <button
                    onClick={() => { setStep("phone"); setError(""); }}
                    className="w-full text-center text-white/40 text-xs hover:text-white/60"
                  >
                    تغییر شماره
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>

      <GlassDialog open={profileOpen} onOpenChange={(nextOpen) => {
        if (nextOpen) setProfileOpen(true);
      }}>
        <GlassDialogContent className="max-w-md" dir="rtl">
          <GlassDialogHeader className="items-start text-right">
            <GlassDialogTitle>تکمیل پروفایل</GlassDialogTitle>
            <GlassDialogDescription>
              برای شروع بهتر، فقط چند اطلاعات پایه لازم داریم.
            </GlassDialogDescription>
          </GlassDialogHeader>

          <div className="mt-6 space-y-3">
            {profileError && (
              <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">
                {profileError}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-white/50">نام</label>
              <GlassInput
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="مثلا: محمدرضا"
                className="h-12 text-right text-white placeholder:text-white/35"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/50">نام خانوادگی</label>
              <GlassInput
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="اختیاری"
                className="h-12 text-right text-white placeholder:text-white/35"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/50">تاریخ تولد</label>
              <GlassInput
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="h-12 text-right text-white placeholder:text-white/35"
              />
            </div>

            <GlassButton
              variant="primary"
              className="w-full"
              onClick={handleCompleteProfile}
              disabled={!firstName.trim() || !birthDate || loading}
            >
              {loading ? "در حال ساخت پروفایل..." : "شروع کنیم"}
            </GlassButton>
          </div>
        </GlassDialogContent>
      </GlassDialog>
            {/* <GlassButton variant="subscription">
        خرید اشتراک
      </GlassButton> */}
    </header>
  );
}
