import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface FieldsetProps {
    title?: React.ReactNode;
    className?: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
    children?: React.ReactNode;
    width?: number
}

/**
 * Fieldset component designed for ReUI + Tailwind projects.
 * - Accessible (uses native <fieldset>/<legend>)
 * - Optional collapsible mode
 * - Shows description, error, required marker, and badge
 * - Accepts className to plug into ReUI theming
 */
const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
    (
        {
            title,
            className,
            collapsible = false,
            defaultOpen = true,
            children,
            width
        },
        ref
    ) => {
        const [openState, setOpenState] = useState<boolean>(defaultOpen);

        const handleToggle = () => {
            if (!collapsible) return;
            setOpenState(!openState);
        };

        const legendContent = (
            <div className="flex items-center gap-2">
                {collapsible ? (
                    <button
                        type="button"
                        aria-expanded={openState}
                        onClick={handleToggle}
                        className="flex items-center gap-2 p-1 rounded-md hover:bg-muted"
                    >
                        <span className="sr-only">Toggle</span>
                        {openState ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>
                ) : null}

                <div className="flex items-baseline gap-2">
                    <div className={cn("font-medium text-sm")}>
                        {title}
                    </div>
                </div>
            </div>
        );

        return (
            <fieldset
                ref={ref}
                style={{ width: width }}
                className={cn(
                    "reui-fieldset group border rounded-lg px-2 bg-card",
                    className
                )}
            >
                {title ? (
                    <legend className={cn(
                        "mb-2 flex items-center gap-3",
                    )}>
                        {legendContent}
                    </legend>
                ) : null}

                <div
                    className={cn(
                        "transition-max-h overflow-hidden",
                        collapsible ? (openState ? "max-h-[2000px] pb-2" : "max-h-0") : "max-h-[2000px] pb-2"
                    )}
                >
                    <div className={cn("space-y-1")}>{children}</div>
                </div>

            </fieldset>
        );
    }
);

Fieldset.displayName = "Fieldset";

export default Fieldset;
