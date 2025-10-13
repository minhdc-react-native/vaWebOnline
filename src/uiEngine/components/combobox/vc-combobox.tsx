import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";

import {
    Command,
    CommandInput,
    CommandList,
} from '@/components/ui/command';
import { Button, ButtonArrow } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { X } from "lucide-react";
import { useT } from "@/i18n/config";

export interface IColumn {
    id: string;
    label?: string;
    format?: IFormatDate | IFormatNumber;
    width?: number
}
const columnDefault: IColumn[] = [
    { id: "id", width: 100 },
    { id: "value", width: 250 },
];
type IFormatDate = {
    type: 'date',
    format?: 'dd/mm/yyyy' | 'yyyy-mm-dd';
}
type IFormatNumber = {
    type: 'number',
    round?: number;
}

export type IAsyncData = (inputValue: string, callback: (options: IData[]) => void) => Promise<void>;

interface IProgs {
    name: string;
    value: string | number;
    source: IData[] | IAsyncData;
    iconLeft?: IconName;
    columns?: IColumn[];
    placeholder?: string;
    placeholderSearch?: string;
    disabled?: boolean;
    cleanable?: boolean;
    display?: { fId?: string, fValue?: string, fDisplay?: string };
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onSelect?: (itemSelected: IData | null) => void;
}
export default function VcComboBox({ value, source, iconLeft, columns = columnDefault,
    placeholder, placeholderSearch, disabled, cleanable, display = { fId: 'id', fValue: 'value', fDisplay: 'value' }, className,
    onChange, onSelect
}: IProgs) {
    display = { ...display, fId: display.fId ?? 'id', fValue: display.fValue ?? 'value', fDisplay: display.fDisplay ?? 'value' };

    const isConstData = Array.isArray(source);

    const [data, setData] = useState<IData[]>([]);
    const [dataFilter, setDataFilter] = useState<IData[]>([]);
    const reloadSource = useCallback(async () => {
        if (Array.isArray(source)) {
            const dataFix = source.map(s => ({
                ...s,
                valueSearch: `${s[display.fId!]} ${s[display.fValue!]}`.toLowerCase()
            }));
            setData(dataFix);
            setDataFilter(dataFix);
        }
    }, [display.fId, display.fValue, source]);

    useEffect(() => {
        reloadSource();
    }, [reloadSource]);

    const [itemSelected, setItemSelected] = useState<IData | null>(null);

    const onChangeSelected = useCallback((item: IData | null) => {
        setItemSelected(item);
        if (isConstData) setDataFilter(data);
        onChange?.(item?.[display.fId!] || null);
        onSelect?.(item);
        // expression...

    }, [data, display.fId, isConstData, onChange, onSelect]);

    useEffect(() => {
        if (!!value && !itemSelected) {
            // console.log('data,value>>', data, value);
            setItemSelected(data.find((item => item[display.fId!] === value)) ?? null);
        }
    }, [data, value]);

    const [open, setOpen] = useState(false);

    const totalWidth = useMemo(() => {
        return columns.reduce((sum: number, col: any) => sum + (col?.width ?? 100), 0);
    }, [columns]);

    const onSearch = useMemo(() =>
        debounce((textSearch: string, dataFull: IData[] = data) => {
            if (isConstData) {
                const filtered = dataFull.filter((u: IData) => u.valueSearch.includes(textSearch.toLowerCase()));
                setDataFilter(filtered);
            } else {
                source(textSearch, (options: IData[]) => {
                    const dataFix = options.map(s => ({
                        ...s,
                        valueSearch: `${s[display.fId!]} ${s[display.fValue!]}`.toLowerCase()
                    }));
                    // setData(dataFix);
                    setDataFilter(dataFix);
                })
            }
        }, 500), [data, display.fId, display.fValue, isConstData, source]);

    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (dataFilter.length === 0) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightIndex((prev) => (prev + 1) % dataFilter.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightIndex((prev) => (prev - 1 + dataFilter.length) % dataFilter.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightIndex >= 0 && highlightIndex < dataFilter.length) {
                    onChangeSelected(dataFilter[highlightIndex]);
                    setOpen(false);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, dataFilter, highlightIndex, onChangeSelected]);

    useEffect(() => {
        if (open) setHighlightIndex(-1);
    }, [open, dataFilter]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    mode="input"
                    placeholder={!value}
                    disabled={disabled}
                    aria-expanded={open}
                    className={cn("flex items-center justify-between w-full", className)}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {iconLeft && <DynamicIcon name={iconLeft} className="absolute left-2.5 top-1/2 w-4 h-4 shrink-0 opacity-70 text-gray-400" />}
                        <span className={cn("truncate", iconLeft ? "ml-5" : "")}>
                            {itemSelected?.[display.fDisplay!] || placeholder}
                        </span>
                    </div>
                    {itemSelected?.[display.fDisplay!] && cleanable ? <ButtonArrow icon={X} className="text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            setItemSelected(null);
                        }
                        } /> : <ButtonArrow />}
                </Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: `${totalWidth}px` }} className="p-0">
                <Command>
                    <CommandInput placeholder={placeholderSearch} onValueChange={onSearch} />
                    <CommandList>
                        <CustomMenuList itemSelected={itemSelected} fId={display.fId!} columns={columns} data={dataFilter} onSelect={(item) => {
                            onChangeSelected(item);
                            setOpen(false);
                        }} highlightIndex={highlightIndex} />
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
interface IMenuList {
    itemSelected: IData | null;
    fId: string;
    columns: IColumn[];
    data: IData[];
    onSelect: (item: IData) => void;
    highlightIndex?: number;
}
const CustomMenuList = ({ itemSelected, fId, columns, data, onSelect, highlightIndex = -1 }: IMenuList) => {
    const _ = useT();
    return (
        <table className="w-full border-collapse table-fixed">
            <colgroup>
                {columns.map((col: any) => (
                    <col key={col.id} style={{ width: col.width }} />
                ))}
            </colgroup>
            <thead className="bg-muted text-xs font-medium text-muted-foreground sticky top-[0px] z-10">
                <tr>
                    {columns.map((col: any) => (
                        <th
                            key={col.id}
                            className="px-3 py-2 text-left border-b border-border"
                        >
                            {_(col.label || col.id)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, idx) => {
                    return (
                        <CustomOption key={item[fId]} columns={columns} item={item} isSelected={item[fId] === itemSelected?.[fId]} onSelect={onSelect} isHighlighted={idx === highlightIndex} />
                    );
                })}
            </tbody>
        </table>
    );
};
interface IOption {
    columns: IColumn[];
    item: IData;
    isSelected: boolean,
    onSelect: (item: IData) => void;
    isHighlighted: boolean
}
const CustomOption = ({ columns, item, isSelected, onSelect, isHighlighted }: IOption) => {
    const rowRef = useRef<HTMLTableRowElement | null>(null);

    useEffect(() => {
        if ((isHighlighted) && rowRef.current) {
            rowRef.current.scrollIntoView({
                block: "center",
                behavior: "smooth",
            });
        }
    }, [isHighlighted]);

    return (
        <tr
            ref={rowRef}
            onClick={() => onSelect(item)}
            className={cn(
                "cursor-pointer transition-colors",
                isSelected && "bg-amber-50 font-bold",
                isHighlighted && "bg-amber-100"
            )}
        >
            {columns.map((col: any) => (
                <td
                    key={item[col.id]}
                    className="px-3 py-2 border-b border-border text-sm text-foreground truncate"
                >
                    {item[col.id]}
                </td>
            ))}
        </tr>
    );
};