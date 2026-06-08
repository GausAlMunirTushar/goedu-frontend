"use client";

import { cn } from "@/lib/utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        className={cn(
            "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent " +
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                "focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 " +
                "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input font-[inherit]",
            className,
        )}
        {...props}
    >
        <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-background shadow " +
                    "ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] " +
                    "data-[state=unchecked]:translate-x-0",
            )}
        />
    </SwitchPrimitive.Root>
));

Switch.displayName = "Switch";

export { Switch };
