"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-4 rounded-2xl",
        "bg-white/[0.05] backdrop-blur-xl border border-white/10",
        "shadow-[0_0_30px_rgba(0,255,255,0.08)]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),

        months: "flex flex-col gap-4",
        month: "flex flex-col gap-4",

        nav: "flex items-center justify-between mb-2",

        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0 text-white/70 hover:text-cyan-300"
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0 text-white/70 hover:text-cyan-300"
        ),

        month_caption: "flex justify-center items-center mb-2",
        caption_label:
          "text-sm font-medium text-white tracking-wide",

        weekdays: "flex",
        weekday:
          "flex-1 text-center text-xs text-white/40 uppercase",

        week: "flex w-full mt-1",

        day: "flex-1",

        today:
          "bg-cyan-500/20 text-cyan-300 rounded-md",

        outside:
          "text-white/20",

        disabled:
          "text-white/20 opacity-40",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            );
          }
          return (
            <ChevronDownIcon
              className={cn("size-4", className)}
              {...props}
            />
          );
        },

        DayButton: CalendarDayButton,

        ...components,
      }}
      {...props}
    />
  );
}

/* 🔥 Day Button (Most Important Part) */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-selected={modifiers.selected}
      className={cn(
        "aspect-square w-full h-9 text-sm font-medium",

        /* Default */
        "text-white/70",

        /* Hover */
        "hover:bg-white/10 hover:text-white",

        /* Selected */
        "data-[selected=true]:bg-cyan-500",
        "data-[selected=true]:text-black",
        "data-[selected=true]:shadow-[0_0_12px_rgba(0,255,255,0.6)]",

        /* Range */
        "data-[range-middle=true]:bg-cyan-500/20",
        "data-[range-start=true]:bg-cyan-500",
        "data-[range-end=true]:bg-cyan-500",

        /* Smooth */
        "transition-all duration-200",

        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };