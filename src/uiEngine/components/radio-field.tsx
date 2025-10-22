import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

interface RadioOption {
    id: string;
    value: string;
    vertical?: boolean
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
    const vertical = options[0]?.vertical !== undefined ? true : options[0]?.vertical;
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
                                ? "relative flex flex-row items-start gap-2"
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
                        {!label && <div style={{ width: labelWidth }} />}
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className={cn('flex', vertical ? 'flex-row' : 'flex-col')}>
                                {options.map((opt) => (
                                    <FormItem
                                        key={opt.id}
                                        className={`flex flex-row items-center space-x-2`}
                                    >
                                        <FormControl>
                                            <RadioGroupItem value={opt.id} />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">{opt.value}</FormLabel>
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
