"use client"

import { useState } from "react"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { GlassInput } from "@/components/ui/glass-input"
import { GlassButton } from "@/components/ui/glass-button"
import { Label } from "@radix-ui/react-label"
import Grainient from "@/components/Grainient"

export default function ForgotPasswordPageBlock() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSubmitted(true)
  }

  const handleBack = () => {
    setIsSubmitted(false)
    setEmail("")
  }

  return (
    <div className="min-h-screen py-4 flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-40">


      <GlassCard className="w-full max-w-md">
        {!isSubmitted ? (
          <>
            <GlassCardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg bg-linear-to-br from-orange-400 to-red-500">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <GlassCardTitle className="text-2xl">بازیابی رمز عبور</GlassCardTitle>
              <GlassCardDescription className="text-white/65">
                مشکلی در ورود دارید؟ ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود.
              </GlassCardDescription>
            </GlassCardHeader>

            <GlassCardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/65 text-right" dir="rtl">
                    آدرس ایمیل شما
                  </Label>
                  <GlassInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5"
                  />
                  <p className="text-xs text-white/65 mt-1 text-right" dir="rtl">
                    مطمئن شوید که ایمیل وارد شده صحیح است و به آن دسترسی دارید، زیرا لینک بازیابی به این آدرس ارسال خواهد شد.
                  </p>
                </div>

                {/* Submit Button */}
                <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                      ... در حال ارسال
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      ارسال لینک بازیابی
                    </>
                  )}
                </GlassButton>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex items-center justify-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </button>
              </form>
            </GlassCardContent>
          </>
        ) : (
          <>
            <GlassCardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg bg-linear-to-br from-green-400 to-emerald-500">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <GlassCardTitle className="text-2xl">ایمیل های خود را چک کنید</GlassCardTitle>
              <GlassCardDescription className="text-white/65 " >
                ما ایمیل بازیابی رمز عبورتان را برایتان ارسال کردیم{" "}
                <span className="font-medium text-white/65 justify-center" >{email}</span>
              </GlassCardDescription>
            </GlassCardHeader>

            <GlassCardContent className="space-y-6">
              {/* Success Message */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400" dir="rtl">
                  لطفاً صندوق ورودی ایمیل خود را بررسی کنید و روی لینک بازیابی رمز عبور کلیک کنید تا یک رمز عبور جدید تنظیم کنید. اگر ایمیل را دریافت نکردید، ممکن است در پوشه اسپم یا هرزنامه باشد.
                </p>
              </div>

              {/* Helpful Tips */}
              <div className="space-y-3" dir="rtl">
                <h3 className="text-sm font-medium text-white/80">ایمیل دریافت نکردید؟</h3>
                <ul className="space-y-2 text-xs text-white/60">
                  <li className="flex gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>پوشه اسپم یا هرزنامه را بررسی کنید.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>مطمئن شوید که ایمیل درست را وارد کرده اید.</span>
                  </li>
                </ul>
              </div>

              {/* Resend Option */}
              <div className="flex gap-2">
                <GlassButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  از اول شروع کنید
                </GlassButton>
                <GlassButton
                  type="button"
                  variant="primary"
                  className="flex-1"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    "ارسال مجدد ایمیل"
                  )}
                </GlassButton>
              </div>

              {/* Contact Support */}
              <p className="text-center text-xs text-white/50 pt-4 border-t border-white/10" dir="rtl">
                همچنان به کمک نیاز دارید؟{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Contact support
                </a>
              </p>
            </GlassCardContent>
          </>
        )}
      </GlassCard>
    </div>
  )
}
