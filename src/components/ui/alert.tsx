import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Variants */
const alertVariants = cva(
  [
    "relative w-full rounded-xl px-4 py-3 text-sm",
    "border border-white/10",
    "bg-white/[0.04] backdrop-blur-md",

    /* Layout for icons */
    "[&>svg+div]:translate-y-[-2px]",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>svg]:h-5 [&>svg]:w-5",
    "[&>svg~*]:pl-8",

    /* Smooth feel */
    "transition-all duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "text-white/80",
          "shadow-[0_0_20px_rgba(255,255,255,0.05)]",
        ].join(" "),

        destructive: [
          "border-red-500/30",
          "bg-red-500/10",
          "text-red-300",
          "shadow-[0_0_20px_rgba(255,0,0,0.15)]",
          "[&>svg]:text-red-400",
        ].join(" "),

        success: [
          "border-emerald-500/30",
          "bg-emerald-500/10",
          "text-emerald-300",
          "shadow-[0_0_20px_rgba(0,255,150,0.15)]",
          "[&>svg]:text-emerald-400",
        ].join(" "),

        info: [
          "border-cyan-500/30",
          "bg-cyan-500/10",
          "text-cyan-300",
          "shadow-[0_0_20px_rgba(0,255,255,0.15)]",
          "[&>svg]:text-cyan-400",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* Alert Container */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

/* Title */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-semibold tracking-wide text-white",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

/* Description */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm leading-relaxed text-white/70",
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };