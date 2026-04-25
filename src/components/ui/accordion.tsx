import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* Root */
const Accordion = AccordionPrimitive.Root;

/* Item */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-white/10 last:border-none",
      "backdrop-blur-md bg-white/[0.02]",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

/* Trigger */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between",
        "py-4 px-3",
        "text-sm font-medium text-white/80",
        "transition-all duration-200",
        "hover:text-white",
        "focus:outline-none",
        "focus:ring-2 focus:ring-cyan-400/40 rounded-lg",
        "data-[state=open]:text-cyan-300",
        className
      )}
      {...props}
    >
      <span className="tracking-wide">{children}</span>

      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0",
          "text-white/50",
          "transition-all duration-300 ease-in-out",
          "group-hover:text-cyan-300",
          "data-[state=open]:rotate-180 data-[state=open]:text-cyan-400"
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/* Content */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden",
      "text-sm text-white/70",
      "data-[state=open]:animate-accordion-down",
      "data-[state=closed]:animate-accordion-up"
    )}
    {...props}
  >
    <div className={cn("px-3 pb-4 pt-1 leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };