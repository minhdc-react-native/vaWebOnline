import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";

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
    className,
    disabled,
    width
}: RadioFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem style={{ width: width }} className={className}>
                    {label && labelPosition === "top" && (
                        <FormLabel className="mb-2">{label}</FormLabel>
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
                                    {labelPosition === "left" && (
                                        <FormLabel className="text-sm font-normal cursor-pointer">{opt.label}</FormLabel>
                                    )}
                                    <FormControl>
                                        <RadioGroupItem value={opt.value} />
                                    </FormControl>
                                    {labelPosition === "right" && (
                                        <FormLabel className="text-sm font-normal cursor-pointer">{opt.label}</FormLabel>
                                    )}
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
