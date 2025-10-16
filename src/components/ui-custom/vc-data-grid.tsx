import { Cell, flexRender, HeaderGroup, Row } from "@tanstack/react-table";
import { useDataGrid } from "../ui/data-grid";
import { DataGridTableBase, DataGridTableBody, DataGridTableBodyRow, DataGridTableBodyRowCell, DataGridTableBodyRowSkeleton, DataGridTableBodyRowSkeletonCell, DataGridTableEmpty, DataGridTableHead, DataGridTableHeadRow, DataGridTableHeadRowCell, DataGridTableHeadRowCellResize, DataGridTableRowSpacer } from "../ui/data-grid-table";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { RowContextMenu } from "@/pages/vacom/row-context-menu";
interface TableRow<T> {
    id: string | number;
    children?: T[];
}
function DataGridTableBodyRowExpandded<TData>({ row }: { row: Row<TData> }) {
    const { props, table } = useDataGrid();

    return (
        <tr className={cn(props.tableLayout?.rowBorder && '[&:not(:last-child)>td]:border-b')}>
            <td colSpan={row.getVisibleCells().length}>
                {table
                    .getAllColumns()
                    .find((column) => column.columnDef.meta?.expandedContent)
                    ?.columnDef.meta?.expandedContent?.(row.original)}
            </td>
        </tr>
    );
}

export function VcDataGrid<TData extends TableRow<TData>>() {
    const { table, isLoading, props } = useDataGrid();
    const pagination = table.getState().pagination;

    return (
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
                {props.loadingMode === 'skeleton' && isLoading && pagination?.pageSize ? (
                    Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
                        <DataGridTableBodyRowSkeleton key={rowIndex}>
                            {table.getVisibleFlatColumns().map((column, colIndex) => {
                                return (
                                    <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                                        {column.columnDef.meta?.skeleton}
                                    </DataGridTableBodyRowSkeletonCell>
                                );
                            })}
                        </DataGridTableBodyRowSkeleton>
                    ))
                ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row: Row<TData>, index) => {
                        return (
                            <Fragment key={row.id}>
                                <RowContextMenu<TData> row={row.original}>
                                    <DataGridTableBodyRow
                                        className={cn((row.getIsSelected() || props.itemSelected?.id === row.original.id) && 'selected bg-amber-100')}
                                        row={row} key={index}>
                                        {row.getVisibleCells().map((cell: Cell<TData, unknown>, colIndex) => {
                                            return (
                                                <DataGridTableBodyRowCell cell={cell} key={colIndex}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </DataGridTableBodyRowCell>
                                            );
                                        })}
                                    </DataGridTableBodyRow>
                                </RowContextMenu>
                                {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
                            </Fragment>
                        );
                    })
                ) : (
                    <DataGridTableEmpty />
                )}
            </DataGridTableBody>
        </DataGridTableBase>
    );
}