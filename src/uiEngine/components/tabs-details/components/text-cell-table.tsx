import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { IFontWeight, ITextSize, TextField } from "../../text-field";
import { ITypeEditor } from "@/pages/vacom/type";
import { formatDate, formatNumber } from "@/lib/helpers";

interface ITextCellTableProps {
    value: string | number | React.ReactNode;
    typeEditor?: ITypeEditor,
    size?: ITextSize;
    weight?: IFontWeight;
    align?: "left" | "center" | "right";
    muted?: boolean;
    className?: string;
    ellipsis?: boolean; // để text không tràn ra khỏi cell
}

export const TextCellTable: React.FC<ITextCellTableProps> = ({
    value,
    typeEditor = "text",
    size = "sm",
    weight = "normal",
    align = "left",
    muted = false,
    className,
    ellipsis = true,
}) => {
    const fixAlign: 'left' | 'right' | 'center' = useMemo(() => {
        switch (typeEditor) {
            case 'autonumeric':
            case 'number':
                return 'right';
            case 'dateedit':
            case 'datepicker':
                return 'center'
            default:
                return align;
        }
    }, [typeEditor, align]);

    const getValueCell = useCallback((value: any) => {
        switch (typeEditor) {
            case 'autonumeric':
            case 'number':
                return formatNumber(value);
            case 'dateedit':
            case 'datepicker':
                return formatDate(value);
            default:
                return value;
        }
    }, [typeEditor]);
    return (
        <div
            className={cn(
                "px-2 py-1",
                "flex items-center",
                {
                    "justify-start text-left": fixAlign === "left",
                    "justify-center text-center": fixAlign === "center",
                    "justify-end text-right": fixAlign === "right",
                },
                ellipsis && "truncate max-w-full overflow-hidden text-ellipsis whitespace-nowrap",
                className,
            )}
            title={typeof value === "string" ? value : undefined}
        >
            <TextField size={size} weight={weight} muted={muted}>
                {getValueCell(value)}
            </TextField>
        </div>
    );
};
