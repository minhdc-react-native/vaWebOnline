import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckEditorProps {
    value?: boolean | string | number | null;
    onChange?: (value: boolean | string | number | null) => void;
    disabled?: boolean;
    className?: string;
}

export const CheckboxEditor: React.FC<CheckEditorProps> = ({
    value,
    onChange,
    disabled,
    className,
}) => {
    const checked =
        value === true ||
        value === "C" ||
        value === "c" ||
        value === 1 ||
        value === "1";

    const handleChange = (newChecked: boolean) => {
        if (typeof value === "boolean") {
            onChange?.(newChecked);
        } else if (typeof value === "string") {
            onChange?.(newChecked ? "C" : "K");
        } else if (typeof value === "number") {
            onChange?.(newChecked ? 1 : 0);
        } else {
            onChange?.(newChecked);
        }
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center h-full w-full",
                className
            )}
        >
            <Checkbox
                checked={checked}
                onCheckedChange={handleChange}
                disabled={disabled}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
        </div>
    );
};
