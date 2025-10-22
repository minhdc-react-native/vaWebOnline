import { Cell, flexRender, HeaderGroup, Row } from "@tanstack/react-table";
import { useDataGrid } from "../ui/data-grid";
import { DataGridTableBase, DataGridTableBody, DataGridTableBodyRow, DataGridTableBodyRowCell, DataGridTableEmpty, DataGridTableHead, DataGridTableHeadRow, DataGridTableHeadRowCell, DataGridTableHeadRowCellResize, DataGridTableRowSpacer } from "../ui/data-grid-table";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
interface TableRow<T> {
    id: string | number;
    children?: T[];
}
export function VcDataGridVirtualizer<TData extends TableRow<TData>>() {
    const { table, props } = useDataGrid();
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

    const rowVirtualizer = useVirtualizer({
        count: table.getRowModel().rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 32,
        overscan: 20,
    });

    return (
        <div ref={parentRef} className="overflow-auto flex-1">
            <DataGridTableBase>
                <DataGridTableHead>
                    {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>, index) => {
                        return (
                            <DataGridTableHeadRow headerGroup={headerGroup} key={index}>
                                {headerGroup.headers.map((header, index) => {
                                    const { column } = header;

                                    return (
                                        <DataGridTableHeadRowCell header={header} key={index}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            {props.tableLayout?.columnsResizable && column.getCanResize() && (
                                                <DataGridTableHeadRowCellResize header={header} />
                                            )}
                                        </DataGridTableHeadRowCell>
                                    );
                                })}
                            </DataGridTableHeadRow>
                        );
                    })}
                </DataGridTableHead>

                {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && <DataGridTableRowSpacer />}

                <DataGridTableBody>
                    {table.getRowModel().rows.length ? (
                        rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
                            const row = table.getRowModel().rows[virtualRow.index];
                            return (
                                <Fragment key={row.id}>
                                    <DataGridTableBodyRow
                                        className={cn((row.getIsSelected() || props.itemSelected?.id === row.original.id || (props.itemSelected?.rowId !== undefined && props.itemSelected?.rowId === (row.original as any).rowId)) && 'selected bg-amber-100')}
                                        row={row} key={index}>
                                        {row.getVisibleCells().map((cell: Cell<TData, unknown>, colIndex) => {
                                            return (
                                                <DataGridTableBodyRowCell cell={cell} key={colIndex}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </DataGridTableBodyRowCell>
                                            );
                                        })}
                                    </DataGridTableBodyRow>
                                </Fragment>
                            );
                        })
                    ) : (
                        <DataGridTableEmpty />
                    )}
                </DataGridTableBody>
            </DataGridTableBase>
        </div>
    );
}