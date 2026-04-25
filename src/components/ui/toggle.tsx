import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Variants */
const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg text-sm font-medium",

    /* Base */
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
        /* Default glass toggle */
        default: [
          "bg-white/[0.05] backdrop-blur-md",
          "border border-white/10",
          "text-white/70",

          "hover:bg-white/10 hover:text-white",

          /* ON state */
          "data-[state=on]:bg-cyan-500",
          "data-[state=on]:text-black",
          "data-[state=on]:shadow-[0_0_12px_rgba(0,255,255,0.6)]",
        ].join(" "),

        /* Outline variant */
        outline: [
          "border border-white/20",
          "bg-transparent",
          "text-white/70",

          "hover:bg-white/10 hover:text-white",

          /* ON state */
          "data-[state=on]:border-cyan-400",
          "data-[state=on]:text-cyan-300",
          "data-[state=on]:shadow-[0_0_10px_rgba(0,255,255,0.4)]",
        ].join(" "),
      },

      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 text-xs",
        lg: "h-11 px-4 text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/* Component */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      toggleVariants({ variant, size }),
      "hover:scale-105 active:scale-95", // interaction feel
      className
    )}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };