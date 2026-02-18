"use client"

import { useMemo, useState } from "react"
import { Eye, EyeOff, UserPlus, Check } from "lucide-react"
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { GlassInput } from "@/components/ui/glass-input"
import { GlassButton } from "@/components/ui/glass-button"
import { GlassCheckbox } from "@/components/glass-checkbox"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"
import Grainient from "@/components/Grainient"

interface ValidationRules {
  minLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecial: boolean
}

export default function SignupPageBlock() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validatePassword = (pwd: string): ValidationRules => ({
    minLength: pwd.length >= 8,
    hasUpperCase: /[A-Z]/.test(pwd),
    hasLowerCase: /[a-z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  })

  const validation = useMemo(() => validatePassword(password), [password])
  const isPasswordValid = Object.values(validation).every(Boolean)
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid || !passwordsMatch || !agreeToTerms) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    console.log({ firstName, lastName, email, password })
  }

  return (
    <div className="min-h-screen py-4 flex items-center justify-center  px-4 sm:px-6 md:px-12 lg:px-40">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Grainient
          color1="FF4F9A"      
          color2="FDF9FF"     
          color3="2B3FFF"     
          timeSpeed={0.15}    
          grainAmount={0.05}   
          warpStrength={0.8}  
          zoom={1.0}
          className="w-full h-full trans"
        />
      </div>

      <GlassCard className="w-full max-w-md">
        <GlassCardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-green-400 to-emerald-500">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
          <GlassCardTitle className="text-2xl">ساخت حساب کاربری</GlassCardTitle>
          <GlassCardDescription className="text-black/65" dir="rtl">یه چیزی مینویسم اینجا!</GlassCardDescription>
        </GlassCardHeader>

        <GlassCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div dir="rtl" className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-black/65">
                  نام
                </Label>
                <GlassInput
                  id="lastName"
                  type="text"
                  placeholder="محبعلی"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-white/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-black/65">
                  نام خانوادگی
                </Label>
                <GlassInput
                  id="firstName"
                  type="text"
                  placeholder="آرمان"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-white/5"
                />
              </div>
            </div>

            {/* Email Input */}
            <div dir="rtl"className="space-y-2">
              <Label htmlFor="email" className="text-black/65">
                آدرس ایمیل
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
            </div>

            {/* Password Input */}
            <div dir="rtl" className="space-y-2">
              <Label htmlFor="password" className="text-black/65">
                رمز عبور
              </Label>
              <div className="relative">
                <GlassInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs font-medium text-black/60 mb-2" dir="rtl">رمز عبور باید شامل:</p>
                  <div className="grid grid-cols-2 gap-1.5" dir="rtl">
                    {[
                      { key: "minLength", label: "بیشتر از 8 کاراکتر" },
                      { key: "hasUpperCase", label: "دارای حروف یزرگ" },
                      { key: "hasLowerCase", label: "دارای حروف کوچک" },
                      { key: "hasNumber", label: "اعداد" },
                      { key: "hasSpecial", label: "استفاده از حروف خاص" },
                    ].map((rule) => (
                      <div key={rule.key} className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full transition-colors ${
                          validation[rule.key as keyof ValidationRules] ? "bg-green-400" : "bg-white/20"
                        }`} />
                        <span className={`text-xs transition-colors ${
                          validation[rule.key as keyof ValidationRules] ? "text-green-400" : "text-black/65"
                        }`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div dir="rtl" className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black/65">
                تکرار رمز عبور
              </Label>
              <div className="relative">
                <GlassInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!isPasswordValid}
                  className="bg-white/5 pr-10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordsMatch && isPasswordValid && (
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <Check className="h-3 w-3" /> Passwords match
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div  className="flex items-start space-x-2 pt-2">
              <GlassCheckbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => {
                if (typeof checked === 'boolean') {
                  setAgreeToTerms(checked)
                }
              }} />
              <Label htmlFor="terms" className="text-black/65 cursor-pointer text-sm leading-tight">
                I agree to the{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </a>
              </Label>
            </div>

            {/* Submit Button */}
            <GlassButton
              type="submit"
              variant="primary"
              className="w-full mt-6"
              disabled={isLoading || !isPasswordValid || !passwordsMatch || !agreeToTerms}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                  ... درحال ساخت حساب
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  ساخت حساب کاربری
                </>
              )}
            </GlassButton>

            {/* Sign In Link */}
            <p className="text-center text-sm text-black/65" dir="rtl">
              از قبل ثبت نام کرده اید؟{" "}
              <a onClick={() => router.push("/auth/login")} className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Sign in
              </a>
            </p>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
