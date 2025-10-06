import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
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
                            {iconLeft && <DynamicIcon
                                name={iconLeft}
                                size={18}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />}
                            <FormControl>
                                <Input
                                    {...field}
                                    // autoComplete="new-password"
                                    placeholder={placeholder ?? _("Enter password")}
                                    type={visible ? "text" : "password"}
                                    className={iconLeft ? "pl-8" : undefined}
                                />
                            </FormControl>
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
                        {label && labelPosition === "right" && (
                            <FormLabel className="ml-2">{label}</FormLabel>
                        )}
                    </div>
                </FormItem>
            )}
        />
    );
}
