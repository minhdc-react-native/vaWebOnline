import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

import {
    Command,
    CommandInput,
    CommandList,
} from '@/components/ui/command';
import { Button, ButtonArrow } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconName } from "lucide-react/dynamic";
import { X } from "lucide-react";


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
    disabled?: boolean;
    cleanable?: boolean;
    display?: { fId?: string, fValue?: string, fDisplay?: string };
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}
export default function VcComboBox({ value, source, iconLeft, columns = columnDefault,
    placeholder, disabled, cleanable, display = { fId: 'id', fValue: 'value', fDisplay: 'value' }, className,
    onChange
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
    }, [data, display.fId, isConstData, onChange]);

    useEffect(() => {
        if (!!value) {
            setItemSelected(data.find((item => item[display.fId!] === value)) ?? null);
        }
    }, []);

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
                // className="w-[200px]"
                >
                    <span className={cn('truncate')}>
                        {itemSelected?.[display.fDisplay!] || 'Select city...'}
                    </span>
                    {itemSelected?.[display.fDisplay!] ? <ButtonArrow icon={X} className="text-destructive" onClick={() => setItemSelected(null)} /> : <ButtonArrow />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-[${totalWidth}px] p-0`}>
                <Command>
                    <CommandInput placeholder="Search city..." onValueChange={onSearch} />
                    <CommandList>
                        <CustomMenuList itemSelected={itemSelected} fId={display.fId!} columns={columns} data={dataFilter} onSelect={(item) => {
                            onChangeSelected(item);
                            setOpen(false);
                        }} />
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
    onSelect: (item: IData) => void
}
const CustomMenuList = ({ itemSelected, fId, columns, data, onSelect }: IMenuList) => {
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
                            {col.label || col.id}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(item => {
                    return (
                        <CustomOption key={item[fId]} columns={columns} item={item} isSelected={item[fId] === itemSelected?.[fId]} onSelect={onSelect} />
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
}
const CustomOption = ({ columns, item, isSelected, onSelect }: IOption) => {
    return (
        <tr
            onClick={() => onSelect(item)}
            className={cn(
                "cursor-pointer",
                isSelected && "bg-amber-50 font-bold"
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