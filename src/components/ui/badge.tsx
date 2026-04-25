import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Variants */
const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
    "border border-white/10",
    "backdrop-blur-md bg-white/[0.05]",

    /* Smooth feel */
    "transition-all duration-300",
    "hover:scale-105",

    /* Focus */
    "focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "text-white/80",
          "shadow-[0_0_10px_rgba(255,255,255,0.1)]",
        ].join(" "),

        secondary: [
          "bg-purple-500/10",
          "text-purple-300",
          "border-purple-500/30",
          "shadow-[0_0_12px_rgba(180,0,255,0.2)]",
        ].join(" "),

        destructive: [
          "bg-red-500/10",
          "text-red-300",
          "border-red-500/30",
          "shadow-[0_0_12px_rgba(255,0,0,0.2)]",
        ].join(" "),

        outline: [
          "bg-transparent",
          "text-white/70",
          "border-white/20",
        ].join(" "),

        success: [
          "bg-emerald-500/10",
          "text-emerald-300",
          "border-emerald-500/30",
          "shadow-[0_0_12px_rgba(0,255,150,0.2)]",
        ].join(" "),

        info: [
          "bg-cyan-500/10",
          "text-cyan-300",
          "border-cyan-500/30",
          "shadow-[0_0_12px_rgba(0,255,255,0.25)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* Component */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };