import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

/* Root */
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex items-center gap-1 p-1 rounded-xl",

      /* Glass UI */
      "bg-white/[0.05] backdrop-blur-md border border-white/10",

      /* Glow */
      "shadow-[0_0_20px_rgba(0,255,255,0.08)]",

      className
    )}
    {...props}
  />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

/* Trigger */
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex items-center rounded-md px-3 py-1.5 text-sm font-medium",
      "text-white/70",

      "transition-all duration-200",

      /* Hover */
      "hover:text-white hover:bg-white/10",

      /* Active */
      "data-[state=open]:bg-cyan-500 data-[state=open]:text-black",
      "data-[state=open]:shadow-[0_0_10px_rgba(0,255,255,0.5)]",

      className
    )}
    {...props}
  />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

/* Content */
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[12rem] p-1 rounded-xl",

        /* Glass */
        "bg-white/[0.06] backdrop-blur-xl border border-white/10",

        /* Glow */
        "shadow-[0_0_30px_rgba(0,255,255,0.12)]",

        /* Animation */
        "animate-in fade-in zoom-in-95",

        className
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

/* Item */
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(({ className, inset, ...props }: any, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "flex items-center rounded-md px-2 py-1.5 text-sm",
      "text-white/70",

      "transition-all duration-200",

      /* Hover */
      "hover:bg-white/10 hover:text-white",

      /* Focus */
      "focus:bg-cyan-500 focus:text-black",

      inset && "pl-8",

      className
    )}
    {...props}
  />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

/* Checkbox Item */
const MenubarCheckboxItem = React.forwardRef<any, any>(
  ({ className, children, checked, ...props }, ref) => (
    <MenubarPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(
        "relative flex items-center pl-8 pr-2 py-1.5 text-sm rounded-md",
        "text-white/70 hover:text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      <span className="absolute left-2">
        <MenubarPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-cyan-400" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
);

/* Radio Item */
const MenubarRadioItem = React.forwardRef<any, any>(
  ({ className, children, ...props }, ref) => (
    <MenubarPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex items-center pl-8 pr-2 py-1.5 text-sm rounded-md",
        "text-white/70 hover:text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      <span className="absolute left-2">
        <MenubarPrimitive.ItemIndicator>
          <Circle className="h-3 w-3 fill-cyan-400" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
);

/* Separator */
const MenubarSeparator = React.forwardRef<any, any>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Separator
      ref={ref}
      className={cn("my-1 h-px bg-white/10", className)}
      {...props}
    />
  )
);

/* Label */
const MenubarLabel = React.forwardRef<any, any>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Label
      ref={ref}
      className={cn("px-2 py-1 text-xs text-white/40", className)}
      {...props}
    />
  )
);

/* Shortcut */
const MenubarShortcut = ({ className, ...props }: any) => (
  <span
    className={cn("ml-auto text-xs text-white/40", className)}
    {...props}
  />
);

export {
  Menubar,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarShortcut,
};