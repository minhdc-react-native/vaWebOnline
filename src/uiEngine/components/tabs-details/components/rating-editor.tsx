import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingEditorProps {
    value: number;
    onChange: (value: number) => void;
    maxStar?: number;
    editable?: boolean;
    showValue?: boolean;
    className?: string;
}

export function RatingEditor({
    value,
    onChange,
    maxStar = 5,
    editable = true,
    showValue = false,
    className
}: RatingEditorProps) {
    const [hover, setHover] = useState<number | null>(null);

    const handleClick = (val: number) => {
        if (!editable) return;
        onChange(val === value ? 0 : val);
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {[...Array(maxStar)].map((_, index) => {
                const v = index + 1;
                const isChecked = hover ? v <= hover : v <= value;
                return (
                    <div
                        key={v}
                        className={cn(
                            "cursor-pointer transition select-none",
                            isChecked ? "text-yellow-500" : "text-gray-300"
                        )}
                        onClick={() => handleClick(v)}
                        onMouseEnter={() => editable && setHover(v)}
                        onMouseLeave={() => editable && setHover(null)}
                    >
                        <i className="ki-solid ki-star text-base leading-none"></i>
                    </div>
                );
            })}
            {showValue && <span className="text-sm ml-1">{`${value}/${maxStar}`}</span>}
        </div>
    );
}