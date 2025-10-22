import { InputWrapper } from "@/components/ui/input";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl
} from "@/components/ui/form";
import { Control, FieldValues } from "react-hook-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DateInput, DateField } from '@/components/ui/datefield';
import { ErrorMessage } from "./erro-message";
import { CalendarDays, X } from "lucide-react";
import { DateValue, parseDate, parseDateTime } from '@internationalized/date';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { isNotEmpty } from "@/lib/helpers";

interface IDateFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    placeholder?: string;
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    className?: string;
    disabled?: boolean;
    width?: number;
    required?: boolean;
}

const toDateString = (v: DateValue | null) =>
    v ? `${v.year.toString().padStart(4, '0')}-${v.month
        .toString()
        .padStart(2, '0')}-${v.day.toString().padStart(2, '0')}` : null;

export function DateInputField({
    control,
    name,
    label,
    labelPosition = "top",
    labelWidth,
    className,
    disabled,
    width,
    required
}: IDateFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => {
                const isHorizontal = labelPosition === "left" || labelPosition === "right";
                // const fixDate = field.value ? parseDate(field.value) : undefined;
                // setValue(fixDate);
                const fixValue = field.value ? field.value.split(/[ T]/)[0] : field.value;
                return (
                    <FormItem
                        style={{ width: width }}
                        className={cn(isHorizontal
                            ? "relative flex flex-row items-center gap-2"
                            : "relative flex flex-col gap-1", className)}
                    >
                        {label && labelPosition === "top" && <FormLabel className="text-sm font-normal">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }}
                                className={`text-sm font-normal flex-shrink-0 inline-block overflow-hidden text-ellipsis whitespace-nowrap`}>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <FormControl>
                            <InputWrapper>
                                <DateIconPicker value={fixValue ? new Date(fixValue) : undefined}
                                    onSelect={(date) => field.onChange(format(date, 'yyyy-MM-dd'))} />
                                <DateField
                                    value={fixValue ? parseDate(fixValue) : null}
                                    onChange={(val) => field.onChange(toDateString(val))}>
                                    <DateInput />
                                </DateField>
                                {isNotEmpty(fixValue) && !disabled && <X onClick={() => field.onChange(null)} />}
                            </InputWrapper>
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


function DateIconPicker({ value, onSelect }: { value?: Date, onSelect?: (date: Date) => void }) {
    const [open, setOpen] = useState(false);
    const onSelectDate = (date: Date) => {
        setOpen(false);
        onSelect?.(date)
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <CalendarDays />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={value} onSelect={onSelectDate} defaultMonth={value} autoFocus required />
            </PopoverContent>
        </Popover>
    );
}