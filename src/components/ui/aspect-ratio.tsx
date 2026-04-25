import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

import { cn } from "@/lib/utils";

/* Root */
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-xl",
      "bg-white/[0.03] backdrop-blur-sm",
      "border border-white/10",
      className
    )}
    {...props}
  >
    {/* Content wrapper */}
    <div className="absolute inset-0 h-full w-full">
      {children}
    </div>
  </AspectRatioPrimitive.Root>
));

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };