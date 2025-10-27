import React, { useCallback } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/api/apiMethods";
import VcComboBox, { IColumn } from "../../combobox/vc-combobox";

interface ISelectEditorProps {
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    cleanable?: boolean;
    source?: IData[] | { url: string; keyFilter: string };
    columns?: IColumn[];
    expression?: Record<string, string>;
    onUpdate?: (values: Record<string, any>) => void;
    display?: { fId?: string; fValue?: string; fDisplay?: string };
    width?: number;
}

export const SelectEditor: React.FC<ISelectEditorProps> = ({
    value,
    onChange,
    placeholder,
    disabled,
    cleanable,
    source = [],
    columns,
    expression = {},
    onUpdate,
    display,
    width,
}) => {
    const fnApi = React.useCallback(
        async (inputValue: string, callback: (options: IData[]) => void) => {
            if (!Array.isArray(source)) {
                await api.get({
                    link: source.url.replace(source.keyFilter, encodeURIComponent(inputValue)),
                    callBack: (res) => callback(res),
                });
            }
        },
        [source]
    );

    const onSelect = useCallback((item: IData | null) => {
        onChange(item?.[display?.fId ?? "value"]);
        const update: Record<string, any> = {};
        Object.keys(expression).map(exp => {
            update[exp] = item?.[expression[exp]];
        });
        onUpdate?.(update);
    }, [display?.fId, expression, onChange, onUpdate]);

    return (
        <div
            className={cn(
                "flex items-center justify-center h-full px-1",
                "focus-within:border focus-within:border-ring focus-within:rounded-md focus-within:bg-background"
            )}
            style={{ width }}
        >
            <VcComboBox
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                source={Array.isArray(source) ? source : fnApi}
                columns={columns}
                cleanable={cleanable}
                display={display}
                onSelect={onSelect}
                className="border-none"
            />
        </div>
    );
};
