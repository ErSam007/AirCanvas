"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

/* Provider */
const TooltipProvider = TooltipPrimitive.Provider;

/* Root */
const Tooltip = TooltipPrimitive.Root;

/* Trigger */
const TooltipTrigger = TooltipPrimitive.Trigger;

/* Content */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50",

        /* Glass look */
        "rounded-lg px-3 py-1.5 text-xs",
        "bg-white/[0.08] backdrop-blur-md border border-white/10",

        /* Text */
        "text-white/90",

        /* Glow */
        "shadow-[0_0_12px_rgba(0,255,255,0.25)]",

        /* Animation */
        "transition-all duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in data-[state=closed]:fade-out",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",

        /* Directional slide */
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=top]:slide-in-from-bottom-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",

        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };