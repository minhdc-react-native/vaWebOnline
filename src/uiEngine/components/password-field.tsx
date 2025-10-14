import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { ErrorMessage } from "./erro-message";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/config";

interface PasswordFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    labelPosition?: "top" | "left" | 'right';
    labelWidth?: number;
    width?: number;
    iconLeft?: IconName;
    className?: string;
    disabled?: boolean;
    required?: boolean;
}

export function PasswordField({
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
    required
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);
    const _ = useT();
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field, fieldState }) => (
                <FormItem style={{ width: width }}>
                    <div
                        className={cn(labelPosition === "left"
                            ? "flex items-center gap-2 relative"
                            : "flex flex-col gap-1 relative", className)}
                    >
                        {label && labelPosition === "top" && <FormLabel className="abc">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }} className={`min-w-[100px]`}>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <div className="relative w-full">
                            <FormControl>
                                <InputWrapper>
                                    {iconLeft && <DynamicIcon
                                        name={iconLeft}
                                        size={18}
                                    />}
                                    <Input
                                        {...field}
                                        // autoComplete="new-password"
                                        placeholder={placeholder ?? _("Enter password")}
                                        type={visible ? "text" : "password"}
                                        className={iconLeft ? "pl-8" : undefined}
                                    />
                                    {field.value !== '' && <X onClick={() => field.onChange("")} />}
                                    <DynamicIcon
                                        name={visible ? "eye-off" : "eye"}
                                        onClick={() => setVisible(!visible)}
                                        size={18}
                                    />
                                </InputWrapper>
                            </FormControl>
                            <ErrorMessage />
                        </div>
                        {label && labelPosition === "right" && (
                            <FormLabel className="ml-2">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
}
