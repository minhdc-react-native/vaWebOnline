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
import { Search, X } from "lucide-react";
import { useT } from "@/i18n/config";
import { filterTree, findInTree, mapTreeWithValueSearch } from "@/lib/helpers";
import { useVirtualizer } from '@tanstack/react-virtual';

export interface IColumn {
    id: string;
    label?: string;
    format?: IFormatDate | IFormatNumber;
    width?: number
}
const columnDefault: IColumn[] = [
    { id: "value", label: 'GIA_TRI' },
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
    width?: number
}
export default function VcComboBox({ value, source, iconLeft, columns = columnDefault,
    placeholder, placeholderSearch, disabled, cleanable, display = {}, className,
    onChange, onSelect, width
}: IProgs) {

    display = { ...display, fId: display.fId ?? 'id', fValue: display.fValue ?? 'value', fDisplay: display.fDisplay ?? 'value' };

    const isConstData = Array.isArray(source);

    const [data, setData] = useState<IData[]>([]);
    const [dataFilter, setDataFilter] = useState<IData[]>([]);

    const reloadSource = useCallback(async () => {
        if (Array.isArray(source)) {
            const dataFix = mapTreeWithValueSearch(source, display.fId!, display.fValue!);
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
        // // if (isConstData) setDataFilter(data);
        onChange?.(item?.[display.fId!] || null);
        onSelect?.(item);
        // expression...

    }, [display.fId, onChange, onSelect]);

    useEffect(() => {
        if (!!value && !itemSelected && Array.isArray(data)) {
            const foundItem = findInTree(data, display.fId!, value);
            setItemSelected(foundItem ?? null);
        }
    }, [data, value]);

    const [open, setOpen] = useState(false);

    const totalWidth = useMemo(() => {
        return columns.reduce((sum: number, col: any) => sum + (col?.width ?? 100), 0);
    }, [columns]);

    const [txtSearch, setTxtSearch] = useState("");
    const onSearch = useMemo(() =>
        debounce((textSearch: string, dataFull: IData[] = data) => {
            if (isConstData) {
                const filtered = textSearch
                    ? filterTree(dataFull, textSearch)
                    : dataFull; // nếu không search thì giữ nguyên

                setDataFilter(filtered);
            } else {
                source(textSearch, (options: IData[]) => {
                    const dataFix = options.map(s => ({
                        ...s,
                        valueSearch: `${s[display.fId!]} ${s[display.fValue!]}`.toLowerCase()
                    }));
                    setDataFilter(dataFix);
                });
            }
        }, 500),
        [data, display.fId, display.fValue, isConstData, source]
    );

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


    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const [triggerWidth, setTriggerWidth] = useState<number>(0);

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setTriggerWidth(entry.contentRect.width);
                }
            });
            resizeObserver.observe(triggerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    const popoverWidth = useMemo(
        () => Math.max(triggerWidth, totalWidth),
        [triggerWidth, totalWidth]
    );

    const fixValue = isConstData ? itemSelected?.[display.fDisplay!] : value;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild style={{ width }}>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    mode="input"
                    placeholder={!value}
                    disabled={disabled}
                    aria-expanded={open}
                    className={cn("flex items-center justify-between w-full text-xs", className)}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {iconLeft && <DynamicIcon name={iconLeft} className="absolute left-2.5 top-1/2 w-4 h-4 shrink-0 opacity-70 text-gray-400" />}
                        <span className={cn("truncate", iconLeft ? "ml-5" : "", !fixValue && "text-muted-foreground")}>
                            {fixValue || placeholder}
                        </span>
                    </div>
                    {fixValue && cleanable && !disabled ? <ButtonArrow icon={X} className="text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            setItemSelected(null);
                        }
                        } /> : <ButtonArrow icon={isConstData ? undefined : Search} />}
                </Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: totalWidth, minWidth: popoverWidth }} className="p-0" align="start">
                <Command>
                    <CommandInput value={txtSearch} placeholder={placeholderSearch} onValueChange={(value) => {
                        setTxtSearch(value);
                        onSearch(value);
                    }} />
                    <CommandList>
                        <CustomMenuList itemSelected={itemSelected} fId={display.fId!} columns={columns} data={dataFilter} onSelect={(item) => {
                            onChangeSelected(item);
                            setOpen(false);
                        }} highlightIndex={highlightIndex} totalWidth={totalWidth} />
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
    totalWidth: number;
}
const CustomMenuList = ({ itemSelected, fId, columns, data, onSelect, highlightIndex = -1, totalWidth }: IMenuList) => {
    const _ = useT();
    const parentRef = useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32, // chiều cao ước tính của mỗi dòng (px) ~ <td>:h-8
        overscan: 20, // render thêm các dòng ngoài vùng nhìn
    });
    return (
        <div ref={parentRef} className="max-h-[300px] overflow-auto border-t">
            <table className="w-full border-collapse table-fixed relative">
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
                <tbody
                // style={{
                //     position: 'relative',
                //     height: `${rowVirtualizer.getTotalSize()}px`,
                // }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow, idx) => {
                        const item = data[virtualRow.index];
                        return (
                            <CustomOption key={item[fId]} columns={columns} item={item} itemSelected={itemSelected} onSelect={onSelect} isHighlighted={idx === highlightIndex} />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
interface IOption {
    columns: IColumn[];
    item: IData;
    itemSelected: IData | null,
    onSelect: (item: IData) => void;
    isHighlighted: boolean
}
const CustomOption = ({
    columns,
    item,
    itemSelected,
    isHighlighted,
    onSelect,
}: IOption) => {
    const rowRef = useRef<HTMLTableRowElement | null>(null);
    const [isExpanded, setExpanded] = useState(true);

    const hasChildren = item.children && item.children.length > 0;
    const level = item.level || 0;

    useEffect(() => {
        if (isHighlighted && rowRef.current) {
            rowRef.current.scrollIntoView({
                block: "center",
                behavior: "smooth",
            });
        }
    }, [isHighlighted]);

    return (
        <>
            <tr
                ref={rowRef}
                onClick={() => {
                    onSelect(item);
                }}
                className={cn(
                    "cursor-pointer transition-colors",
                    (itemSelected?.id === item.id) && "bg-amber-50 font-bold",
                    isHighlighted && "bg-amber-50"
                )}
            >
                {columns.map((col: any, idx: number) => (
                    <td
                        key={idx}
                        className={cn(
                            "px-3 py-2 border-b border-border text-sm text-foreground truncate"
                        )}
                    >
                        {idx === 0 ? (
                            <div className="flex items-center">
                                <div
                                    style={{ width: `${level * 16}px` }}
                                    className="shrink-0"
                                />
                                {hasChildren && (
                                    <button
                                        type="button"
                                        className="mr-1 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpanded(!isExpanded);
                                        }}
                                    >
                                        {isExpanded ? (
                                            <DynamicIcon name="minus-square" size={14} className="text-muted-foreground cursor-pointer" />
                                        ) : (
                                            <DynamicIcon name="plus-square" size={14} className="text-muted-foreground  cursor-pointer" />
                                        )}
                                    </button>
                                )}
                                <span>{item[col.id]}</span>
                            </div>
                        ) : (
                            item[col.id]
                        )}
                    </td>
                ))}
            </tr>

            {isExpanded &&
                hasChildren &&
                item.children.map((child: any) => (
                    <CustomOption
                        key={child.id}
                        columns={columns}
                        item={{ ...child, level: level + 1 }}
                        itemSelected={itemSelected}
                        isHighlighted={false}
                        onSelect={onSelect}
                    />
                ))}
        </>
    );
};