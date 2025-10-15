import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

interface RadioOption {
    label: string;
    value: string;
}

interface RadioFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    options: RadioOption[];
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    className?: string;
    disabled?: boolean;
    width?: number
}

export function RadioField({
    control,
    name,
    label,
    options,
    labelPosition = "right",
    labelWidth,
    className,
    disabled,
    width
}: RadioFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => {
                const isHorizontal = labelPosition === "left" || labelPosition === "right";
                return (
                    <FormItem style={{ width }}
                        className={cn(
                            isHorizontal
                                ? "relative flex flex-row items-center gap-2"
                                : "relative flex flex-col gap-1",
                            className
                        )}>
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
                            <RadioGroup onValueChange={field.onChange} value={field.value}>
                                {options.map((opt) => (
                                    <FormItem
                                        key={opt.value}
                                        className={`${labelPosition === "left" || labelPosition === "right"
                                            ? "flex flex-row items-center space-x-2"
                                            : "flex flex-col space-y-1"
                                            }`}
                                    >
                                        {label && labelPosition === "top" && <FormLabel className="text-sm font-normal">{label}</FormLabel>}
                                        {labelPosition === "left" && (
                                            <FormLabel style={{ width: labelWidth }} className="text-sm font-normal flex-shrink-0 inline-block">{opt.label}</FormLabel>
                                        )}
                                        <FormControl>
                                            <RadioGroupItem value={opt.value} />
                                        </FormControl>
                                        {labelPosition === "right" && (
                                            <FormLabel className="text-sm font-normal">{opt.label}</FormLabel>
                                        )}
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        {label && labelPosition === "right" && (
                            <FormLabel className="text-sm font-normal">{label}</FormLabel>
                        )}
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    );
}
