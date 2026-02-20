"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

const glassButtonVariants = cva(
  cn(
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl cursor-pointer",
    "text-sm font-medium transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:scale-[1.02] active:scale-[0.98]" ,
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-white/5 backdrop-blur-xl border border-white/10 text-white/90",
          "shadow-[0_6px_24px_rgba(0,0,0,0.25)]",
          "hover:bg-white/10 hover:border-white/20",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/20 before:to-transparent before:pointer-events-none",
        ),
        primary: cn(
          "bg-gradient-to-r from-[#8C86FF]/70 to-[#6CA7FF]/70",
          "backdrop-blur-xl border border-white/15 text-white",
          "shadow-[0_8px_30px_rgba(140,134,255,0.25)]",
          "hover:shadow-[0_10px_40px_rgba(140,134,255,0.35)]",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/30 before:to-transparent before:pointer-events-none",
        ),
        outline: cn(
          "bg-white/3 backdrop-blur-md border border-white/15 text-white/80",
          "hover:bg-white/8 hover:border-white/25",
        ),
        ghost: cn("bg-transparent text-white/70", "hover:bg-white/10 hover:text-white"),
        destructive: cn(
          "bg-cyan-500/30 backdrop-blur-xl border border-cyan-400/40 text-red-100",
          "shadow-[0_4px_16px_rgba(70,68,68,0.3)]",
          "hover:bg-green-500/40 hover:border-green-400/60",
          "before:absolute before:inset-0 before:rounded-xl",
          "before:bg-linear-to-b before:from-white/10 before:to-transparent before:pointer-events-none",
        ),
        subscription: cn(
          "bg-gradient-to-r from-[#8C86FF]/30 to-[#6CA7FF]/30",
          "border border-white/15 text-white",
          "shadow-[0_6px_20px_rgba(124,140,255,0.25)]",
          "hover:from-[#8C86FF]/40 hover:to-[#6CA7FF]/40",
      ),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  glowEffect?: boolean,
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, asChild = false, size, glowEffect = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <div className="relative inline-block">
        {glowEffect && (
          <div className="bg-gradient-to-r from-[#8C86FF]/30 via-[#6CA7FF]/30 to-[#F3A6FF]/30 blur-2xl opacity-60" />
        )}
        <Comp className={cn(glassButtonVariants({ variant, size, className }))} ref={ref} {...props}>
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </Comp>
      </div>
    )
  },
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
