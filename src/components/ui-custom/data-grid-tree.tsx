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
import { ChevronRight, ChevronDown } from "lucide-react";

interface TreeRow<T> {
    id: string | number;
    children?: T[];
}

export function DataGridTree<TData extends TreeRow<TData>>() {
    const { table, props } = useDataGrid();

    // Trạng thái mở rộng của tree (bạn có thể lưu ở react-table state nếu muốn)
    const [expanded, setExpanded] = React.useState<Record<string | number, boolean>>({});

    const toggleRow = (rowId: string | number) => {
        setExpanded((prev) => ({
            ...prev,
            [rowId]: !(prev[rowId] !== undefined ? prev[rowId] : true),
        }));
    };

    const renderTreeRows = (row: Row<TData>, level = 0) => {
        const rowData = row.original;

        const hasChildren = Array.isArray(rowData.children) && rowData.children.length > 0;
        const isExpanded = expanded[row.id] !== undefined ? expanded[row.id] : true;;

        return (
            <Fragment key={row.id}>
                <DataGridTableBodyRow
                    row={row}
                    className={cn(level > 0 && "bg-muted/20")}
                >
                    {row.getVisibleCells().map((cell, colIndex) => {
                        const content = flexRender(cell.column.columnDef.cell, cell.getContext());

                        return (
                            <DataGridTableBodyRowCell cell={cell} key={colIndex}>
                                {colIndex === 0 ? (
                                    <div className="flex items-center">
                                        <div style={{ width: level * 16 }} />
                                        {hasChildren ? (
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
                                                    <ChevronDown size={14} className="text-muted-foreground" />
                                                ) : (
                                                    <ChevronRight size={14} className="text-muted-foreground" />
                                                )}
                                            </button>
                                        ) : (<div style={{ width: 22 }} />)}
                                        {content}
                                    </div>
                                ) : (
                                    content
                                )}
                            </DataGridTableBodyRowCell>
                        );
                    })}
                </DataGridTableBodyRow>

                {hasChildren && isExpanded && rowData.children!.map((child, index) => {
                    const subRow = table.getRowModel().rows.find(r => r.original === child);
                    return subRow ? renderTreeRows(subRow, level + 1) : null;
                })}
            </Fragment>
        );
    };

    return (
        <DataGridTableBase>
            <DataGridTableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <DataGridTableHeadRow key={headerGroup.id} headerGroup={headerGroup}>
                        {headerGroup.headers.map((header) => (
                            <DataGridTableHeadRowCell header={header} key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </DataGridTableHeadRowCell>
                        ))}
                    </DataGridTableHeadRow>
                ))}
            </DataGridTableHead>

            <DataGridTableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows
                        .filter((r) => !(r.original as any).parentId) // Chỉ render root node
                        .map((row) => renderTreeRows(row))
                ) : (
                    <DataGridTableEmpty />
                )}
            </DataGridTableBody>
        </DataGridTableBase>
    );
}
