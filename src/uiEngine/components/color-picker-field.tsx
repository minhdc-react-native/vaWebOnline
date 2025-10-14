import React, { useState } from "react";
import { Control, FieldValues } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputWrapper, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ErrorMessage } from "./erro-message";

const DEFAULT_COLORS = [
    "#000000", "#FFFFFF",
    "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF",
    "#808080", "#800000", "#808000",
    "#008000", "#800080", "#008080"
];

interface ColorPickerPopupFieldProps {
    control: Control<FieldValues>;
    name: string;
    label?: string;
    labelPosition?: "top" | "left" | "right";
    width?: number | string;
    labelWidth?: number;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
    palette?: string[];
    required?: boolean;
}

export function ColorPickerField({
    control,
    name,
    label,
    labelPosition = "top",
    width,
    labelWidth,
    className,
    disabled,
    placeholder = "Chọn màu...",
    palette = DEFAULT_COLORS,
    required
}: ColorPickerPopupFieldProps) {
    const [open, setOpen] = useState(false);
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field, fieldState }) => {
                const isHorizontal = labelPosition === "left" || labelPosition === "right";

                const color = field.value || "";

                return (
                    <FormItem
                        style={width ? { width } : undefined}
                        className={cn(
                            isHorizontal
                                ? "relative flex flex-row items-center gap-2"
                                : "relative flex flex-col gap-1",
                            className
                        )}
                    >
                        {label && labelPosition === "top" && <FormLabel>{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }} className="min-w-[100px]">
                                {label}{required && <span className="text-destructive pl-1">*</span>}
                            </FormLabel>
                        )}

                        <FormControl>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "flex items-center justify-between w-full h-9 px-2.5 text-sm leading-tight",
                                            "border border-input bg-background rounded-md",
                                            "hover:bg-accent/20",
                                            disabled && "opacity-50 cursor-not-allowed",
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-5 h-5 rounded border border-border"
                                                style={{ backgroundColor: color || "#fff" }}
                                            />
                                            <span className="truncate text-xs">{color || placeholder}</span>

                                        </div>
                                        {field.value !== '' && <X onClick={(e) => {
                                            e.stopPropagation();
                                            field.onChange("");
                                        }} />}
                                    </Button>

                                </PopoverTrigger>

                                <PopoverContent className="w-[250px] p-3" align="start">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="color"
                                                value={color || "#ffffff"}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                    // setOpen(false);
                                                }}
                                                className="w-10 h-10 border border-border rounded cursor-pointer"
                                            />
                                            <Input
                                                value={color}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder="#rrggbb"
                                                className="text-xs"
                                            />
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 mt-1">
                                            {palette.map((c) => (
                                                <div
                                                    key={c}
                                                    onClick={() => {
                                                        field.onChange(c);
                                                        setOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-6 h-6 rounded border cursor-pointer",
                                                        color === c
                                                            ? "ring-2 ring-offset-1 ring-primary"
                                                            : "border-border"
                                                    )}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </FormControl>

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
