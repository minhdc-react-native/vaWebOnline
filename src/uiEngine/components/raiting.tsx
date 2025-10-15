import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Control, FieldValues } from "react-hook-form";

interface RatingFieldProps {
    control: Control<FieldValues, any, FieldValues>;
    name: string;
    label?: string;
    labelPosition?: "top" | "left" | "right";
    labelWidth?: number;
    className?: string;
    disabled?: boolean;
    width?: number;
    required?: boolean;
    maxStar?: number;
    editable?: boolean;
    showValue?: boolean;
}

export function RatingField({
    control,
    name,
    label,
    labelPosition = "right",
    labelWidth,
    className,
    disabled,
    width,
    required,
    maxStar,
    editable,
    showValue
}: RatingFieldProps) {
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
                        className={cn(isHorizontal ? "flex flex-row items-center space-x-2" : "flex flex-col space-y-1", className)}
                    >
                        {label && labelPosition === "top" && (
                            <FormLabel className="text-sm font-normal">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        {label && labelPosition === "left" && (
                            <FormLabel style={{ width: labelWidth }}
                                className="text-sm font-normal flex-shrink-0 inline-block overflow-hidden text-ellipsis whitespace-nowrap">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <FormControl>
                            <Rating rating={field.value} onChange={field.onChange} maxStar={maxStar} editable={editable} showValue={showValue} />
                        </FormControl>

                        {label && labelPosition === "right" && (
                            <FormLabel className="text-sm font-normal">{label}{required && <span className="text-destructive pl-1">*</span>}</FormLabel>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}

interface RatingProps {
    className?: string;
    rating: number;
    round?: number;
    editable?: boolean;
    maxStar?: number;
    onChange?: (value: number) => void;
    showValue?: boolean;
}

function Rating({
    className = 'text-yellow-500',
    rating,
    editable = true,
    onChange,
    maxStar = 5,
    showValue = true
}: RatingProps) {
    const [hover, setHover] = useState<number | null>(null);

    const handleClick = (value: number) => {
        if (!editable || !onChange) return;
        onChange(value === rating ? 0 : value);
    };
    return (
        <div className={cn("rating flex gap-1 w-full", className)}>
            {[...Array(maxStar)].map((_, index) => {
                const value = index + 1;
                const isChecked = hover ? value <= hover : value <= rating;
                return (
                    <div
                        key={index}
                        className={cn(
                            "kt-rating-label cursor-pointer select-none transition",
                            isChecked ? "checked" : ""
                        )}
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => editable && setHover(value)}
                        onMouseLeave={() => editable && setHover(null)}
                    >
                        <i className="kt-rating-on ki-solid ki-star text-base leading-none"></i>
                        <i className="kt-rating-off ki-outline ki-star text-base leading-none"></i>
                    </div>
                );
            })}
            {showValue && <span>{`${rating !== null ? rating : ''}/${maxStar}`}</span>}
        </div>
    );
}