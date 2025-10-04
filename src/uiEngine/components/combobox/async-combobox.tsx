import AsyncSelect from "react-select/async";
import { components } from 'react-select';
import { cn } from "@/lib/utils";
import { inputVariants } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useFormField } from "@/components/ui/form";

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
export default function AsyncComboBox({ value, source, iconLeft, columns = columnDefault,
    placeholder, disabled, cleanable, display = { fId: 'id', fValue: 'value', fDisplay: 'value' }, className,
    onChange
}: IProgs) {

    const { error } = useFormField();
    const isError = !!error?.message;

    display = { ...display, fId: display.fId ?? 'id', fValue: display.fValue ?? 'value', fDisplay: display.fDisplay ?? 'value' };

    const isConstData = Array.isArray(source);

    const domRectRef = useRef<DOMRect | null>(null);

    const [data, setData] = useState<IData[]>(isConstData ? source.map(s => ({
        ...s,
        valueSearch: `${s[display.fId!]} ${s[display.fValue!]}`.toLowerCase()
    })) : []);

    const [itemSelected, setItemSelected] = useState<IData | null>(null);

    const onChangeSelected = useCallback((item: IData | null) => {
        setItemSelected(item);
        onChange?.(item?.[display.fId!] || null);
    }, [display.fId, onChange]);

    const loadOptions = useMemo(() =>
        debounce((inputValue: string, callback: (options: IData[]) => void) => {
            if (isConstData) {
                const filtered = data.filter((u: IData) => u.valueSearch.includes(inputValue.toLowerCase()));
                callback(filtered);
            } else {
                source(inputValue, (options: IData[]) => {
                    setData(options);
                    callback(options);
                })
            }
        }, 500), [data]);

    const totalWidth = useMemo(() => {
        return columns.reduce((sum: number, col: any) => sum + (col?.width ?? 100), 0);
    }, [columns]);

    const reloadSource = useCallback(async () => {
        if (Array.isArray(source)) {
            setData(source.map(s => ({
                ...s,
                valueSearch: `${s[display.fId!]} ${s[display.fValue!]}`.toLowerCase()
            })));
        }
    }, [display.fId, display.fValue, source]);

    useEffect(() => {
        reloadSource();
    }, [reloadSource]);

    useEffect(() => {
        if (!!value) {
            setItemSelected(data.find((item => item[display.fId!] === value)) ?? null);
        }
    }, [data]);

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions={data}
            menuPlacement="auto"
            loadOptions={loadOptions}
            getOptionLabel={(option) => option[display.fDisplay!].toString()}
            getOptionValue={(option) => option[display.fId!].toString()}
            isClearable={cleanable}
            isDisabled={disabled}
            value={itemSelected}
            onChange={onChangeSelected}
            placeholder={placeholder}
            menuPosition="absolute"
            menuShouldBlockScroll
            closeMenuOnScroll={false}
            menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => {
                    const spaceToRight = window.innerWidth - (domRectRef.current?.left ?? 0) - 10;
                    const maginLeft = totalWidth > spaceToRight ? (totalWidth - spaceToRight) : 0;
                    return ({ ...base, marginLeft: `-${maginLeft}px` })
                },
                control: () => ({}),
            }}
            components={{
                Control: (progs) => <CustomControl domRectRef={domRectRef} {...progs} />,
                Menu: CustomMenu,
                MenuList: CustomMenuList,
                Option: CustomOption,
                NoOptionsMessage: CustomNoOptionsMessage,
                LoadingMessage: CustomLoadingMessage
            }}
            className={className}
            //@ts-expect-error:next-line
            iconLeft={iconLeft}
            isError={isError}
            columns={columns}
        />
    );
}

const CustomControl = ({ domRectRef, ...props }: any) => {
    const { innerProps, innerRef, isFocused, children, selectProps } = props;
    const isError: boolean = selectProps.isError;
    const iconLeft: IconName = selectProps.iconLeft;
    const ref = useRef<HTMLDivElement | null>(null);
    const className = cn(
        inputVariants({ variant: "md" }),
        "flex items-center min-h-[35px] px-0",
        isFocused && "ring-ring/30 border-ring outline-none ring-[3px]",
        iconLeft && "pl-6",
        isError && "border-destructive ring-destructive/20"
    );
    useLayoutEffect(() => {
        if (ref.current) {
            requestAnimationFrame(() => {
                domRectRef.current = ref.current?.getBoundingClientRect() ?? null
            })
        }
    }, [isFocused]);
    return (
        <>
            {iconLeft && <DynamicIcon name={iconLeft} size={24} className='absolute pl-2 top-2/4 -translate-y-2/4 text-gray-400' />}
            <components.Control
                {...props}
                innerProps={{
                    ...innerProps,
                    className,
                }}
                innerRef={(node: HTMLDivElement) => {
                    ref.current = node;
                    if (typeof innerRef === "function") {
                        innerRef(node);
                    } else if (innerRef) {
                        (innerRef as any).current = node;
                    }
                    // domRectRef.current = node?.getBoundingClientRect();
                }}

            >
                {children}
            </components.Control>
        </>
    );
};

const CustomMenu = (props: any) => {
    const { children, innerProps, selectProps } = props;
    const columns = selectProps.columns || [];
    const totalWidth = columns.reduce((sum: number, col: any) => sum + col.width, 0);
    return (
        <components.Menu {...props}>
            <div
                {...innerProps}
                className="bg-background border border-input rounded-md shadow-md overflow-hidden z-50"
                style={{ width: totalWidth }}
            >
                {children}
            </div>
        </components.Menu>
    );
};
const CustomMenuList = (props: any) => {
    const { children, selectProps } = props;
    const columns = selectProps.columns || [];

    return (
        <components.MenuList
            {...props}
            className="max-h-[300px] overflow-auto p-0" // 👈 scroll nằm ở đây luôn
        >
            <table className="w-full border-collapse table-fixed">
                <colgroup>
                    {columns.map((col: any) => (
                        <col key={col.id} style={{ width: col.width }} />
                    ))}
                </colgroup>
                <thead className="bg-muted text-xs font-medium text-muted-foreground sticky top-[-4px] z-10">
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
                <tbody>{children}</tbody>
            </table>
        </components.MenuList>
    );
};
const CustomOption = (props: any) => {
    const {
        data,
        innerRef,
        innerProps,
        isFocused,
        isSelected,
        selectOption,
        selectProps,
    } = props;

    const handleClick = () => {
        selectOption(data);
        selectProps.onMenuClose();
    };

    const columns = selectProps.columns || [];

    return (
        <tr
            ref={innerRef}
            {...innerProps}
            onClick={handleClick}
            className={cn(
                "cursor-pointer",
                isFocused && "bg-gray-50",
                isSelected && "bg-amber-50 font-bold"
            )}
        >
            {columns.map((col: any) => (
                <td
                    key={data[col.id]}
                    className="px-3 py-2 border-b border-border text-sm text-foreground truncate"
                >
                    {data[col.id]}
                </td>
            ))}
        </tr>
    );
};
const CustomNoOptionsMessage = (props: any) => {
    const { selectProps } = props;
    const columns = selectProps.columns || [];

    return (
        <tr>
            <td
                colSpan={columns.length}
                className="px-3 py-2 text-center text-muted-foreground text-sm"
            >
                No results found
            </td>
        </tr>
    );
};
const CustomLoadingMessage = (props: any) => {
    const { selectProps } = props;
    const columns = selectProps.columns || [];

    return (
        <tr>
            <td
                colSpan={columns.length}
                className="px-3 py-2 text-center text-muted-foreground text-sm justify-center items-center"
            >
                <LoaderCircleIcon className="h-4 w-4 animate-spin" />
            </td>
        </tr>
    );
};