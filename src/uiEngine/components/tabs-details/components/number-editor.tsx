import React from "react";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NumberEditorProps {
    value: number | null;
    onChange: (value: number | null) => void;
    onBlur: () => void;
    onFocus?: () => void;
    placeholder?: string;
    disabled?: boolean;
    thousandSeparator?: string;
    decimalSeparator?: string;
    decimalScale?: number;
    allowNegative?: boolean;
}

export const NumberEditor: React.FC<NumberEditorProps> = ({
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    disabled,
    thousandSeparator = " ",
    decimalSeparator = ".",
    decimalScale = 0,
    allowNegative = true,
}) => {
    return (
        <NumericFormat
            value={value ?? ""}
            onValueChange={(values) => onChange?.(values.floatValue ?? null)}
            disabled={disabled}
            placeholder={placeholder}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            allowNegative={allowNegative}
            fixedDecimalScale
            customInput={CustomInput}
            onBlur={onBlur}
            onFocus={onFocus}
            className={cn(
                "w-full border-none outline-none text-right flex-1 text-sm ",
                value && value < 0 ? "text-destructive" : ""
            )}
        />
    );
};

const CustomInput = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
    <Input
        {...props}
        ref={ref}
        className={cn(
            "w-full border-none",
            props.className
        )}
    />
));
CustomInput.displayName = "CustomInput";
