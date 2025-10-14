import {
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form";
import { Control, FieldValues, useFormContext } from "react-hook-form";
import { IconName } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "../erro-message";
import { useCallback, useMemo } from "react";
import { api } from "@/api/apiMethods";
import VcComboBox, { IColumn } from "./vc-combobox";
import { useT } from "@/i18n/config";
import { InputWrapper } from "@/components/ui/input";

interface ISelectFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    width?: number;
    iconLeft?: IconName
    className?: string;
    disabled?: boolean;
    cleanable?: boolean;
    source?: IData[] | { url: string, keyFilter: string };
    columns?: IColumn[];
    expression?: Record<string, string>;
    display?: { fId?: string, fValue?: string, fDisplay?: string };
    required?: boolean;
}

export function SelectField({
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
    cleanable,
    source = [],
    expression = {},
    columns,
    display,
    required
}: ISelectFieldProps) {
    const _ = useT();
    const { setValue } = useFormContext();
    const placeholderDefault = useMemo(() => {
        return _('Select') + ' ' + label;
    }, [_, label]);

    const placeholderSearch = useMemo(() => {
        return _('Search') + ' ' + label;
    }, [_, label]);

    const fnApi = useCallback(async (inputValue: string, callback: (options: IData[]) => void) => {
        if (!Array.isArray(source)) {
            await api.get({
                link: source.url.replace(source.keyFilter, inputValue),
                callBack: (res) => callback(res)
            });
        }
    }, [source]);

    const onSelect = useCallback((item: IData | null) => {
        Object.keys(expression).map(exp => {
            setValue?.(exp, item?.[expression[exp]]);
        })
    }, [expression, setValue]);

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
                        {label && labelPosition === "top" && <FormLabel className="abc">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }} className={`min-w-[100px]`}>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}

                        <VcComboBox placeholder={placeholder || placeholderDefault} placeholderSearch={placeholderSearch} {...field} source={Array.isArray(source) ? source : fnApi}
                            columns={columns} cleanable={cleanable} iconLeft={iconLeft} display={display} onSelect={onSelect} />

                        {label && labelPosition === "right" && (
                            <FormLabel className="ml-2">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <ErrorMessage />
                    </FormItem>
                );
            }}
        />
    );
}
