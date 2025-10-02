import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    useFormField
} from "@/components/ui/form";
import { ErrorMessage } from "./erro-message";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

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
    const renderInput = useCallback((field: ControllerRenderProps<FieldValues, string>) => {
        return <FormControl>{type === "input" ?
            <Input placeholder={placeholder} {...field} className={iconLeft ? "pl-8" : undefined} />
            :
            <Textarea placeholder={placeholder} {...field} className={iconLeft ? "pl-8" : undefined} />}
        </FormControl>
    }, [placeholder, type, iconLeft]);
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
                            <DynamicIcon name={iconLeft} size={24} className='absolute pl-2 top-2/4 -translate-y-2/4 text-gray-400' />
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
