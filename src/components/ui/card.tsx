import * as React from "react";

import { cn } from "@/lib/utils";

/* Root */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl",

      /* Glass UI */
      "bg-white/[0.05] backdrop-blur-xl",
      "border border-white/10",

      /* Depth */
      "shadow-[0_0_30px_rgba(0,255,255,0.08)]",

      /* Smooth interaction */
      "transition-all duration-300",
      "hover:shadow-[0_0_40px_rgba(0,255,255,0.15)]",

      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/* Header */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-5",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* Title */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-base font-semibold tracking-wide",
      "text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* Description */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-white/60 leading-relaxed",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* Content */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-5 pb-5",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

/* Footer */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between px-5 pb-5 pt-2",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};