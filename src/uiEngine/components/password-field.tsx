import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { ErrorMessage } from "./erro-message";

interface PasswordFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    labelPosition?: "top" | "left" | 'right';
    iconLeft?: IconName;
    className?: string;
}

export function PasswordField({
    control,
    name,
    label,
    placeholder,
    labelPosition = "top",
    iconLeft,
    className
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem>
                    <div
                        className={
                            `${labelPosition === "left"
                                ? "flex items-center gap-2 relative"
                                : "flex flex-col gap-1 relative"} ${className || ''}`
                        }
                    >
                        {label && <FormLabel>{label}</FormLabel>}

                        <div className="relative w-full">
                            {iconLeft && <DynamicIcon name={iconLeft} size={24} className='absolute pl-2 top-2/4 -translate-y-2/4 text-gray-400' />}
                            <Input
                                {...field}
                                placeholder={placeholder ?? "Enter password"}
                                type={visible ? "text" : "password"}
                                className={iconLeft ? "pl-8" : undefined}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                mode="icon"
                                onClick={() => setVisible(!visible)}
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            >
                                {visible ? (
                                    <EyeOff className="text-muted-foreground" />
                                ) : (
                                    <Eye className="text-muted-foreground" />
                                )}
                            </Button>

                            <ErrorMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    );
}
