import React from "react";
import { cn } from "@/lib/utils";
export type ITextSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type IVariant = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type IFontWeight = "normal" | "medium" | "semibold" | "bold";

interface ITextFieldProps extends React.HTMLAttributes<
    HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement
> {
    variant?: IVariant;
    size?: ITextSize;
    weight?: IFontWeight;
    muted?: boolean;
    children: React.ReactNode;
}

const sizeMap: Record<ITextSize, string> = {
    xs: "fs-8",   // nhỏ nhất
    sm: "fs-7",
    md: "fs-6",
    lg: "fs-5",
    xl: "fs-4",
    xxl: "fs-3",  // lớn nhất
};

const weightMap = {
    normal: "",
    medium: "fw-medium",
    semibold: "fw-semibold",
    bold: "fw-bold",
};

export const TextField: React.FC<ITextFieldProps> = ({
    variant = "span",
    size,
    weight = "normal",
    muted = false,
    className,
    children,
    ...rest
}) => {

    const Tag = variant as React.ElementType;

    return (
        <Tag
            className={cn(
                size && sizeMap[size],
                weightMap[weight],
                muted && "text-muted",
                className
            )}
            {...rest}
        >
            {children}
        </Tag>
    );
};
