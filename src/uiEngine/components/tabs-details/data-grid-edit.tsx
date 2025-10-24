import React, { useMemo, useState, useRef, useEffect } from 'react'
//
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    Cell,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button';
import { Delete, Plus } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// Give our default column cell renderer editing superpowers!
import { useVirtualizer } from "@tanstack/react-virtual";
import { Input } from '@/components/ui/input';

function EditableCell({
    getValue,
    row: { index },
    column: { id },
    table,
}: any) {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
    };

    // Đồng bộ khi giá trị ban đầu thay đổi từ bên ngoài
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <input
            value={value ?? ""}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            style={{ width: "100%" }}
        />
    );
}

export const defaultColumn: Partial<ColumnDef<IData>> = {
    cell: (props) => <EditableCell {...props} />,
};

function useSkipper() {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}
interface IProgsDataGridEdit {
    data: IData[],
    columns: ColumnDef<IData>[],
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}
export function DataGridEdit({ data, columns, updateData }: IProgsDataGridEdit) {

    const [rows, setRows] = useState<IData[]>(data);
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const handleAction = (action: 'add' | 'delete') => {
        switch (action) {
            case "add":

                break;
            case "delete":

                break;
            default:
                break;
        }
    }

    const parentRef = useRef<HTMLDivElement | null>(null);
    const [parentHeight, setParentHeight] = useState(0);

    useEffect(() => {
        if (!parentRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            setParentHeight(entry.contentRect.height);
        });
        resizeObserver.observe(parentRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const table = useReactTable({
        data: rows,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                skipAutoResetPageIndex()
                updateData(rowIndex, columnId, value);
            },
        },
        debugTable: true,
    })

    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32,
        overscan: 20,
    });

    const totalWidth = useMemo(() => {
        return columns.reduce((sum: number, col: any) => sum + (col?.size ?? 100), 0);
    }, [columns]);

    return (
        <div ref={parentRef} className="flex flex-col flex-1 min-h-0 max-w-full border rounded-lg rounded-tl-none">
            <ToolbarTableDetail handleAction={handleAction} />
            <ScrollArea className="flex flex-1 min-h-0 max-w-full overflow-auto">
                <table className="flex-1 h-full w-full max-w-full table-fixed text-sm" style={{ width: totalWidth }}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            width: header.getSize(),
                                            minWidth: header.column.columnDef.minSize,
                                            maxWidth: header.column.columnDef.maxSize,
                                        }}
                                        className="border p-2 text-left bg-gray-100 sticky top-0 z-10 truncate"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                            const row = table.getRowModel().rows[virtualRow.index];
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell: Cell<IData, unknown>, colIndex) => {
                                        return (
                                            <td
                                                key={cell.id}
                                                style={{ width: cell.column.getSize() }}
                                                className="border p-2"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <ScrollBar orientation="horizontal" />
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    )
}

const ToolbarTableDetail = ({ handleAction }: { handleAction: (action: 'add' | 'delete') => void }) => {
    return (
        <div className="gap-2 items-center p-1 rounded-tr-lg">
            <Button type="button" variant="ghost" mode="icon" onClick={() => handleAction("add")}>
                <Plus className="text-green-900" />
            </Button>
            <Button type="button" variant="ghost" mode="icon" onClick={() => handleAction("delete")}>
                <Delete className="text-red-900" />
            </Button>
        </div>
    );
}