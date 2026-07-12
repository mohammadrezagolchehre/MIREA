"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  glowOnFocus?: boolean
  label?: string
  error?: string
}

const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, glowOnFocus = false, label, error, id, ...props }, ref) => {
    const textareaId = id || "glass-textarea-id"
    const errorId = `${textareaId}-error`

    return (
      <div className="relative rounded-2xl overflow-hidden overflow-y-hidden">
        {label && (
          <motion.label
            htmlFor={textareaId}
            className="block text-sm font-medium text-white/80 mb-2"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
        >
          {glowOnFocus &&  (
            <motion.div
              className="hidden bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 blur-md group-focus-within:from-cyan-500/30 group-focus-within:via-blue-500/30 group-focus-within:to-purple-500/30 transition-all duration-300"
              aria-hidden="true"
            />
          )}
          <textarea
            id={textareaId}
            className={cn(
               "relative w-full rounded-2xl px-5 py-3 text-sm min-h-[52px] md:min-h-[64px]",
               "custom-scroll w-full h-full",
              "bg-[rgba(255,255,255,0.07)] backdrop-blur-xl border border-white/10",
              "text-[#EFF3FB] placeholder:text-[#B8C0D8] text-right",
              "shadow-[0_6px_24px_rgba(2,6,23,0.25)]",
              "transition-all duration-300 resize-none overflow-y-auto",
              "focus:outline-none focus:border-white/40 focus:bg-white/15",
              " focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-400/50 focus:border-red-400/70 focus:ring-red-400/30",
              className,
            
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            id={errorId}
            className="mt-2 text-sm text-red-400"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  },
)
GlassTextarea.displayName = "GlassTextarea"

export { GlassTextarea }
