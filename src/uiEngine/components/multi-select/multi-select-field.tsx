import {
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "../erro-message";
import { useMemo } from "react";
import { useT } from "@/i18n/config";
import MultiSelect from "./multi-select";

interface ISelectFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    width?: number;
    className?: string;
    disabled?: boolean;
    source?: IData[];
    display?: { fId?: string, fValue?: string, fDisplay?: string };
    required?: boolean;
}

export function MultiSelectField({
    control,
    name,
    label,
    placeholder,
    labelPosition = "top",
    labelWidth,
    width,
    className,
    disabled,
    source = [],
    display,
    required
}: ISelectFieldProps) {
    const _ = useT();
    const placeholderDefault = useMemo(() => {
        return _('Select') + ' ' + label;
    }, [_, label]);

    const placeholderSearch = useMemo(() => {
        return _('Search') + ' ' + label;
    }, [_, label]);

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
                            : "relative flex flex-col gap-1", className)}
                    >
                        {label && labelPosition === "top" && <FormLabel className={`text-sm font-normal`}>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }}
                                className={`text-sm font-normal flex-shrink-0 inline-block overflow-hidden text-ellipsis whitespace-nowrap`}>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}

                        <MultiSelect placeholder={placeholder || placeholderDefault} placeholderSearch={placeholderSearch}
                            {...field} source={source} display={display} />

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
