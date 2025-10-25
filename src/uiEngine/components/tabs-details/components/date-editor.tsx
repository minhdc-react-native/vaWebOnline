import { useState, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { DateInput, DateField } from "@/components/ui/datefield";
import { parseDate } from "@internationalized/date";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface IDateEditorProps {
    value: string | null;
    onChange: (value: string | null) => void;
    onBlur: () => void;
}

export function DateEditor({ value, onChange, onBlur }: IDateEditorProps) {
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);

    const fixValue = value ? value.split(/[ T]/)[0] : null;

    const onSelectDate = (date: Date) => {
        const formatted = format(date, "yyyy-MM-dd");
        onChange(formatted);
        setOpen(false);
    };

    return (
        <div
            className={cn(
                "flex items-center gap-1 rounded-md transition-all"
            )}
            style={{ width: "100%" }}
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <CalendarDays
                        size={15}
                        className="shrink-0 w-[15px] h-[15px] text-gray-400 hover:text-gray-500 cursor-pointer"
                    />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={fixValue ? new Date(fixValue) : undefined}
                        onSelect={(date) => date && onSelectDate(date)}
                        defaultMonth={fixValue ? new Date(fixValue) : undefined}
                        autoFocus
                    />
                </PopoverContent>
            </Popover>

            <DateField
                value={fixValue ? parseDate(fixValue) : null}
                onChange={(val) =>
                    onChange(
                        val
                            ? `${val.year.toString().padStart(4, "0")}-${val.month
                                .toString()
                                .padStart(2, "0")}-${val.day
                                    .toString()
                                    .padStart(2, "0")}`
                            : null
                    )
                }
                onFocus={() => setFocused(true)}
                onBlur={() => {
                    setFocused(false);
                    onBlur();
                }}
                className={"w-full p-0 m-0"}
            >
                <DateInput className="border-0 outline-none ring-0 shadow-none bg-transparent w-full p-0 m-0" />
            </DateField>
        </div>
    );
}
