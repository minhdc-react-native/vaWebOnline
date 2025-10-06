import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl
} from "@/components/ui/form";
import { ErrorMessage } from "./erro-message";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/config";

interface IInputFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    type?: "input" | "textarea";
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    iconLeft?: IconName
    className?: string;
    disabled?: boolean;
}

export function InputField({
    control,
    name,
    label,
    placeholder,
    type = "input",
    labelPosition = "top",
    labelWidth,
    iconLeft,
    className,
    disabled
}: IInputFieldProps) {
    const _ = useT();

    const placeholderDefault = useMemo(() => {
        return _('Input') + ' ' + label;
    }, [_, label]);

    const renderInput = useCallback((field: ControllerRenderProps<FieldValues, string>) => {
        return <FormControl>{type === "input" ?
            <Input placeholder={placeholder || placeholderDefault} {...field} className={iconLeft ? "pl-8" : undefined} />
            :
            <Textarea placeholder={placeholder || placeholderDefault} {...field} className={iconLeft ? "pl-8" : undefined} />}
        </FormControl>
    }, [placeholder, placeholderDefault, type, iconLeft]);
    return (

        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => {
                const isHorizontal = labelPosition === "left" || labelPosition === "right";
                return (
                    <FormItem
                        className={cn(isHorizontal
                            ? "relative flex flex-row items-center gap-2"
                            : "relative flex flex-col gap-1", className)}
                    >
                        {label && labelPosition === "top" && <FormLabel className="abc">{label}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel className={labelWidth ? `w-[${labelWidth}px]` : `min-w-[100px]`}>{label}</FormLabel>
                        )}
                        {iconLeft ? <div className="relative w-full">
                            <DynamicIcon
                                name={iconLeft}
                                size={18}
                                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                            {renderInput(field)}
                        </div> :
                            renderInput(field)
                        }

                        {label && labelPosition === "right" && (
                            <FormLabel className="ml-2">{label}</FormLabel>
                        )}
                        <ErrorMessage />
                    </FormItem>
                );
            }}
        />
    );
}
