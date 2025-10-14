import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldValues } from "react-hook-form";

interface CheckboxFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    labelPosition?: "top" | "left" | "right";
    className?: string;
    disabled?: boolean;
    width?: number
}

export function CheckboxField({
    control,
    name,
    label,
    labelPosition = "right",
    className,
    disabled,
    width
}: CheckboxFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => {
                const isHorizontal = labelPosition === "left" || labelPosition === "right";
                return (
                    <FormItem
                        style={{ width: width }}
                        className={cn(isHorizontal ? "flex flex-row items-center space-x-2" : "flex flex-col space-y-1", className)}
                    >
                        {label && labelPosition === "left" && (
                            <FormLabel className="text-sm font-normal cursor-pointer">{label}</FormLabel>
                        )}

                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        {label && labelPosition === "right" && (
                            <FormLabel className="text-sm font-normal cursor-pointer">{label}</FormLabel>
                        )}
                        {label && labelPosition === "top" && (
                            <FormLabel className="text-sm font-normal cursor-pointer">{label}</FormLabel>
                        )}

                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
