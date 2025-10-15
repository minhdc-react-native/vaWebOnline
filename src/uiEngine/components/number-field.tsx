import { Control, FieldValues } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { ErrorMessage } from "./erro-message";
import { cn } from "@/lib/utils";
import { InputWrapper } from "@/components/ui/input";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { X } from "lucide-react";
import React, { useMemo } from "react";
import { useT } from "@/i18n/config";

interface InputNumberFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    width?: number;
    iconLeft?: IconName;
    className?: string;
    disabled?: boolean;
    thousandSeparator?: string;
    decimalSeparator?: string;
    decimalScale?: number;
    allowNegative?: boolean;
    required?: boolean;
}

export function InputNumberField({
    control,
    name,
    label,
    placeholder,
    labelPosition = "top",
    labelWidth,
    width,
    iconLeft,
    className,
    disabled,
    thousandSeparator = " ",
    decimalSeparator = ".",
    decimalScale = 0,
    allowNegative = true,
    required
}: InputNumberFieldProps) {
    const isHorizontal = labelPosition === "left" || labelPosition === "right";
    const _ = useT();
    const placeholderDefault = useMemo(() => {
        return _('Input') + ' ' + label;
    }, [_, label]);
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem
                    style={{ width: width }}
                    className={cn(
                        isHorizontal
                            ? "relative flex flex-row items-center gap-2"
                            : "relative flex flex-col gap-1",
                        className
                    )}
                >
                    {label && labelPosition === "top" && <FormLabel className={`text-sm font-normal`}>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                    {label && labelPosition === "left" && (
                        <FormLabel style={{ width: labelWidth }} className={`text-sm font-normal flex-shrink-0 inline-block overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {label}{required && <span className="text-destructive pl-1">*</span>}
                        </FormLabel>
                    )}

                    <FormControl>
                        <InputWrapper>
                            {iconLeft && <DynamicIcon name={iconLeft} size={18} />}
                            <NumericFormat
                                value={field.value ?? ""}
                                onValueChange={(values) => {
                                    field.onChange(values.floatValue ?? null);
                                }}
                                placeholder={placeholder || placeholderDefault}
                                thousandSeparator={thousandSeparator}
                                decimalSeparator={decimalSeparator}
                                decimalScale={decimalScale}
                                allowNegative={allowNegative}
                                fixedDecimalScale
                                className={field.value < 0 ? 'text-destructive' : undefined}
                                customInput={CustomInput}
                            />
                            {field.value !== "" && field.value != null && (
                                <X onClick={() => field.onChange("")} className="cursor-pointer" />
                            )}
                        </InputWrapper>
                    </FormControl>

                    {label && labelPosition === "right" && <FormLabel className="ml-2 text-sm font-normal">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                    <ErrorMessage />
                </FormItem>
            )}
        />
    );
}


const CustomInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => (
        <input
            {...props}
            ref={ref}
            className={cn("w-full border-none outline-none text-right", props.className)}
        />
    )
);
CustomInput.displayName = "CustomInput";