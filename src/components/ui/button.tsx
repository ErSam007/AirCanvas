import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Variants */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-lg text-sm font-medium",

    /* Base look */
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40",

    /* Disabled */
    "disabled:pointer-events-none disabled:opacity-40",

    /* Icons */
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* 🔥 Primary (most important actions) */
        default: [
          "bg-cyan-500 text-black",
          "shadow-[0_0_12px_rgba(0,255,255,0.4)]",
          "hover:bg-cyan-400",
          "hover:shadow-[0_0_18px_rgba(0,255,255,0.7)]",
          "active:scale-95",
        ].join(" "),

        /* ❗ Destructive */
        destructive: [
          "bg-red-500 text-white",
          "shadow-[0_0_12px_rgba(255,0,0,0.4)]",
          "hover:bg-red-400",
          "hover:shadow-[0_0_18px_rgba(255,0,0,0.7)]",
          "active:scale-95",
        ].join(" "),

        /* 🧊 Outline (glass style) */
        outline: [
          "border border-white/15",
          "bg-white/[0.05] backdrop-blur-md",
          "text-white/80",
          "hover:bg-white/10 hover:text-white",
          "hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]",
        ].join(" "),

        /* 🟣 Secondary */
        secondary: [
          "bg-purple-500/20 text-purple-300",
          "border border-purple-500/30",
          "hover:bg-purple-500/30",
          "hover:shadow-[0_0_12px_rgba(180,0,255,0.3)]",
        ].join(" "),

        /* 👻 Ghost */
        ghost: [
          "text-white/70",
          "hover:bg-white/10 hover:text-white",
        ].join(" "),

        /* 🔗 Link */
        link: [
          "text-cyan-300 underline-offset-4",
          "hover:underline hover:text-cyan-200",
        ].join(" "),
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-9 w-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/* Component */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          "hover:scale-105 active:scale-95", // global interaction feel
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };