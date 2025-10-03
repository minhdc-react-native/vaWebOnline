import AsyncSelect from "react-select/async";
import { components } from 'react-select';
import { cn } from "@/lib/utils";
import { inputVariants } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";
import { useMemo, useRef } from "react";
import debounce from "lodash.debounce";

interface IItem {
    id: string;
    value: string;
}

const units: IItem[] = Array.from({ length: 100 }, (_, i) => {
    const num = String(i + 1).padStart(3, "0");
    return {
        id: num,
        value: `Công ty ${num}`,
    };
});

const listCols = [
    { id: "id", width: 100 },
    { id: "value", width: 400 },
];

export default function AsyncComboBox() {

    const domRectRef = useRef<DOMRect | null>(null);

    const loadOptions = useMemo(() =>
        debounce((inputValue: string, callback: (options: any[]) => void) => {
            const filtered = units.filter(
                (u) =>
                    u.id.toLowerCase().includes(inputValue.toLowerCase()) ||
                    u.value.toLowerCase().includes(inputValue.toLowerCase())
            );
            callback(filtered);
        }, 500), []);

    const totalWidth = useMemo(() => {
        return listCols.reduce((sum: number, col: any) => sum + col.width, 0);
    }, []);

    return (
        <div className="mb-5">
            {/* <FormLabel>Đơn vị</FormLabel> */}
            <AsyncSelect
                cacheOptions
                defaultOptions={units}
                menuPlacement="auto"
                loadOptions={loadOptions}
                getOptionLabel={(option) => option.id}
                getOptionValue={(option) => option.id}
                isClearable={true}
                value={units[5]}
                onChange={(newValue) => console.log(JSON.stringify(newValue))}
                placeholder="Nhập mã hoặc tên..."
                menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                menuPosition="absolute"
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
                //@ts-expect-error:next-line
                columns={listCols}
            />
        </div>
    );
}

const CustomControl = ({ domRectRef, ...props }: any) => {
    const { innerProps, innerRef, isFocused, children } = props;

    const className = cn(
        inputVariants({ variant: "md" }),
        "flex items-center min-h-[30px] px-0",
        isFocused && "ring-ring/30 border-ring outline-none ring-[3px]"
    );
    return (
        <components.Control
            {...props}
            innerProps={{
                ...innerProps,
                className,
            }}

            innerRef={(node: HTMLDivElement) => {
                if (typeof innerRef === "function") {
                    innerRef(node);
                } else if (innerRef) {
                    (innerRef as any).current = node;
                }
                domRectRef.current = node?.getBoundingClientRect();
            }}

        >
            {children}
        </components.Control>
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
                                {col.id}
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