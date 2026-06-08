"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const GlassDropdownMenu = DropdownMenuPrimitive.Root;

const GlassDropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const GlassDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={8}
      className={cn(
        "z-50 min-w-[180px] overflow-hidden rounded-2xl",
        "bg-white/10 backdrop-blur-2xl",
        "border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        "p-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

GlassDropdownMenuContent.displayName =
  DropdownMenuPrimitive.Content.displayName;

const GlassDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center rounded-xl px-3 py-2",
      "text-white/80",
      "hover:bg-white/10",
      "focus:bg-white/10",
      "outline-none transition-colors",
      className
    )}
    {...props}
  />
));

GlassDropdownMenuItem.displayName =
  DropdownMenuPrimitive.Item.displayName;

export {
  GlassDropdownMenu,
  GlassDropdownMenuTrigger,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
};