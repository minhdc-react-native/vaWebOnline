import React, { Fragment } from "react";
import {
    DataGridTableBase,
    DataGridTableHead,
    DataGridTableHeadRow,
    DataGridTableHeadRowCell,
    DataGridTableBody,
    DataGridTableBodyRow,
    DataGridTableBodyRowCell,
    DataGridTableEmpty,
} from "@/components/ui/data-grid-table";
import { flexRender, Row } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useDataGrid } from "@/components/ui/data-grid";
import { DynamicIcon } from "lucide-react/dynamic";
import { FilterColumn } from "./filter-columns";
import { RowContextMenu } from "@/pages/vacom/row-context-menu";
interface IProgs {
    itemSelected?: IData
}
interface TreeRow<T> {
    id: string | number;
    children?: T[];
}

export function DataGridTree<TData extends TreeRow<TData>>({ itemSelected }: IProgs) {
    const { table, props } = useDataGrid();
    const [expanded, setExpanded] = React.useState<Record<string | number, boolean>>({});

    const toggleRow = (rowId: string | number) => {
        setExpanded((prev) => ({
            ...prev,
            [rowId]: !(prev[rowId] !== undefined ? prev[rowId] : true),
        }));
    };

    const renderTreeRows = (row: Row<TData>, level = 0) => {
        const hasChildren = row.subRows.length > 0;
        const isExpanded = expanded[row.id] !== undefined ? expanded[row.id] : true;
        return (
            <Fragment key={row.id}>
                <RowContextMenu<TData> row={row.original}>
                    <DataGridTableBodyRow
                        row={row}
                        className={cn((row.getIsSelected() || itemSelected?.id === row.original.id) && 'selected bg-amber-50', hasChildren && 'font-bold')}
                    >
                        {row.getVisibleCells().map((cell, colIndex) => {
                            const content = flexRender(cell.column.columnDef.cell, cell.getContext());
                            return (
                                <DataGridTableBodyRowCell
                                    cell={cell} key={colIndex}>
                                    {colIndex === 0 ? (
                                        <div className={cn("flex items-center")}>
                                            <div style={{ width: level * 16 }} />
                                            {hasChildren && (
                                                <button
                                                    style={{ width: 18 }}
                                                    type="button"
                                                    className="mr-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleRow(row.id);
                                                    }}
                                                >
                                                    {isExpanded ? (
                                                        <DynamicIcon name="minus-square" size={14} className="text-muted-foreground cursor-pointer" />
                                                    ) : (
                                                        <DynamicIcon name="plus-square" size={14} className="text-muted-foreground  cursor-pointer" />
                                                    )}
                                                </button>
                                            )}
                                            {content}
                                        </div>
                                    ) : (
                                        content
                                    )}
                                </DataGridTableBodyRowCell>
                            );
                        })}
                    </DataGridTableBodyRow>
                </RowContextMenu>
                {hasChildren && isExpanded && row.subRows.map((subRow, index) => {
                    return renderTreeRows(subRow, level + 1);
                })}
            </Fragment>
        );
    };

    return (
        <DataGridTableBase>
            <DataGridTableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <DataGridTableHeadRow
                        key={headerGroup.id} headerGroup={headerGroup}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <DataGridTableHeadRowCell
                                    header={header} key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.columnDef.meta?.filterVariant ? (
                                        <div>
                                            <FilterColumn column={header.column} />
                                        </div>
                                    ) : null}
                                </DataGridTableHeadRowCell>
                            )
                        })}
                    </DataGridTableHeadRow>
                ))}
            </DataGridTableHead>

            <DataGridTableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows
                        .filter((r) => !(r.original as any).parentId)
                        .map((row) => renderTreeRows(row))
                ) : (
                    <DataGridTableEmpty />
                )}
            </DataGridTableBody>
        </DataGridTableBase>
    );
}
