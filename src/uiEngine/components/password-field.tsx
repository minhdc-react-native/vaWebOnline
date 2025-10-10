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
    iconLeft?: IconName;
    className?: string;
    disabled?: boolean;
}

export function PasswordField({
    control,
    name,
    label,
    placeholder,
    labelPosition = "top",
    labelWidth,
    iconLeft,
    className,
    disabled
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);
    const _ = useT();
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field, fieldState }) => (
                <FormItem>
                    <div
                        className={cn(labelPosition === "left"
                            ? "flex items-center gap-2 relative"
                            : "flex flex-col gap-1 relative", className)}
                    >
                        {label && labelPosition === "top" && <FormLabel className="abc">{label}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel className={labelWidth ? `w-[${labelWidth}px]` : `min-w-[100px]`}>{label}</FormLabel>
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
                            <FormLabel className="ml-2">{label}</FormLabel>
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
}
