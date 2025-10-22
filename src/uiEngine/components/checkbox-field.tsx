import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldValues } from "react-hook-form";

interface CheckboxFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    className?: string;
    disabled?: boolean;
    width?: number;
    isNotSpace?: boolean
}

export function CheckboxField({
    control,
    name,
    label,
    labelPosition = "right",
    labelWidth,
    className,
    disabled,
    width,
    isNotSpace
}: CheckboxFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => {
                const isHorizontal = labelPosition === "left" || labelPosition === "right";

                const value = field.value;
                const checked =
                    value === true ||
                    value === "C" ||
                    value === "c" ||
                    value === 1 ||
                    value === "1";

                const handleChange = (newChecked: boolean) => {
                    if (typeof value === "boolean") {
                        field.onChange(newChecked);
                    } else if (typeof value === "string") {
                        field.onChange(newChecked ? "C" : "K");
                    } else if (typeof value === "number") {
                        field.onChange(newChecked ? 1 : 0);
                    } else {
                        field.onChange(newChecked);
                    }
                };

                return (
                    <FormItem
                        style={{ width }}
                        className={cn(
                            isHorizontal
                                ? "relative flex flex-row items-center gap-2"
                                : "relative flex flex-col gap-1",
                            className
                        )}
                    >
                        {!isNotSpace && <div style={{ width: labelWidth }} />}
                        {label && labelPosition === "top" && (
                            <FormLabel className="text-sm font-normal">{label}</FormLabel>
                        )}
                        {label && labelPosition === "left" && (
                            <FormLabel
                                style={{ width: labelWidth }}
                                className="text-sm font-normal flex-shrink-0 inline-block overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                                {label}
                            </FormLabel>
                        )}
                        <FormControl>
                            <Checkbox checked={checked} onCheckedChange={handleChange} />
                        </FormControl>

                        {label && labelPosition === "right" && (
                            <FormLabel className="text-sm font-normal">{label}</FormLabel>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
