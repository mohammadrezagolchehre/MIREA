"use client"

import { useState } from "react"
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card"
import { GlassInput } from "@/components/ui/glass-input"
import { GlassButton } from "@/components/ui/glass-button"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/vakidation";
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPageBlock() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      console.log(data);

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      alert(`Logged in with email: ${data.email}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen py-4 flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-40 ">


      
      <GlassCard className="w-full max-w-md">
        <GlassCardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-lg bg-linear-to-br from-cyan-200 to-blue-500">
              <LogIn className="h-6 w-6 text-white" />
            </div>
          </div>
          <GlassCardTitle className="text-xl text-white">خوش آمدید</GlassCardTitle>
          <GlassCardDescription className="text-white">برای ادامه به حساب کاربری خود وارد شوید</GlassCardDescription>
        </GlassCardHeader>

        <GlassCardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <div dir="rtl" className="space-y-2">
              <Label htmlFor="email" className="text-white/65" >
                آدرس ایمیل
              </Label>
              <GlassInput
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-white/5"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div dir="rtl" className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/65 text-right ">
                  رمز عبور
                </Label>
                          
                <a
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  فراموشی رمز عبور؟
                </a>

                
              </div>
              <div className="relative">
                <GlassInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-white/5 pr-10"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <GlassButton type="submit" variant="primary" className="w-full" disabled={isSubmitting || isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                  ... درحال ورود
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  ورود
                </>
              )}
            </GlassButton>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white" />
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <GlassButton type="button" variant="outline" className="w-full">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </GlassButton>
              <GlassButton type="button" variant="outline" className="w-full">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </GlassButton>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-white/60" dir="rtl">
              حساب کاربری ندارید؟{" "}
              <a onClick={() => router.push("/auth/signup")} className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Sign up
              </a>
            </p>
          </form>
        </GlassCardContent>
      </GlassCard>
    </div>
  )
}
