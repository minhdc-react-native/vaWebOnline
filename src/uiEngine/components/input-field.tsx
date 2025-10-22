import { Input, InputWrapper } from "@/components/ui/input";
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
import { X } from "lucide-react";

interface IInputFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    type?: "input" | "textarea";
    labelPosition?: "top" | "left" | "right";
    width?: number;
    labelWidth?: number;
    iconLeft?: IconName
    className?: string;
    disabled?: boolean;
    required?: boolean;
}

export function InputField({
    control,
    name,
    label,
    placeholder,
    type = "input",
    labelPosition = "top",
    width,
    labelWidth,
    iconLeft,
    className,
    disabled,
    required
}: IInputFieldProps) {
    const _ = useT();
    const placeholderDefault = useMemo(() => {
        return _('Input') + ' ' + label;
    }, [_, label]);

    const renderInput = useCallback((field: ControllerRenderProps<FieldValues, string>) => {
        return type === "input" ?
            (<Input placeholder={placeholder || placeholderDefault} {...field} className={"border-none"} />)
            :
            (<Textarea placeholder={placeholder || placeholderDefault} {...field} className={iconLeft ? "pl-8" : undefined} />)
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
                        style={{ width: width }}
                        className={cn(isHorizontal
                            ? "relative flex flex-row items-center gap-2"
                            : "relative flex flex-col gap-1",
                            className
                        )}
                    >
                        {label && labelPosition === "top" && <FormLabel className="text-sm font-normal">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }}
                                className="text-sm font-normal flex-shrink-0 inline-block overflow-hidden text-ellipsis whitespace-nowrap">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <FormControl style={{ width: labelPosition === "left" && width ? width - (labelWidth ?? 0) : undefined }}>
                            {type === "input" ? <InputWrapper>
                                {iconLeft && <DynamicIcon
                                    name={iconLeft}
                                    size={18}
                                />}
                                {renderInput(field)}
                                {field.value !== '' && !disabled && <X onClick={() => field.onChange("")} />}
                            </InputWrapper> : renderInput(field)}
                        </FormControl>

                        {label && labelPosition === "right" && (
                            <FormLabel className="ml-2 text-sm font-normal">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <ErrorMessage />
                    </FormItem>
                );
            }}
        />
    );
}
