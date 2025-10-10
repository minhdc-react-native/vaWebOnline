import { useParams } from "react-router";
import { Fragment, useState } from "react";
import { Container } from "@/components/common/container";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnFiltersState,
    useReactTable,
    getExpandedRowModel,
    ColumnDef,
    ColumnMeta,
    RowData,
    FilterFnOption,
    Row
} from '@tanstack/react-table';
import { DataGridTree } from "@/components/ui-custom/data-grid-tree";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTreeWindow } from "./useTreeWindow";

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select',
        columnWidth?: number
    }
}

const demoData = [
    {
        id: 0,
        name: "Công ty 0",
        position: "Tổng giám đốc",
    },
    {
        id: 1,
        name: "Công ty 1",
        position: "Tổng giám đốc",
        children: [
            { id: 11, name: "Công ty 11", position: "Trưởng phòng" },
            {
                id: 12,
                name: "Công ty 12",
                position: "Trưởng phòng",
                children: [
                    { id: 121, name: "Công ty 121", position: "Trưởng phòng" },
                    {
                        id: 122,
                        name: "Công ty 122",
                        position: "Trưởng phòng",
                        children: [
                            { id: 1221, name: "Công ty 1221", position: "Trưởng phòng" },
                            {
                                id: 1222,
                                name: "Công ty 1222",
                                position: "Trưởng phòng"
                            }
                        ],
                    }
                ],
            },
        ],
    },
];
const columns: ColumnDef<IData, any>[] = [
    { accessorKey: "name", size: 220, header: "Tên đơn vị", enableSorting: true },
    {
        accessorKey: "position",
        size: 1000,
        //@ts-expect-error:next-line
        filterFn: 'vcEqualsString',
        header: "Chức vụ", meta: {
            filterVariant: "select"
        },

    }
];
export function TreeWindowPage() {
    const { window_id } = useParams();
    const { windowConfig } = useTreeWindow({ window_id })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        columns,
        data: demoData,
        // getRowId: (row: IData) => row.id.toString(),
        // enableMultiRowSelection: false,
        getSubRows: (row: any) => row.children,
        getExpandedRowModel: getExpandedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: {
            vcEqualsString: (row, columnId, filterValue) => {
                const result = (row.getValue(columnId) as string).includes(filterValue);
                return result;
            }
        },
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        filterFromLeafRows: true
    });

    return (
        <Fragment>
            <Container className="flex flex-col h-full">
                <div className="flex flex-col h-full space-y-2.5">
                    <div>
                        <span className="text-black text-lg">HEADER: {window_id}</span>
                    </div>
                    <div className="flex-1 min-h-0">
                        <DataGrid table={table}
                            recordCount={demoData?.length || 0}>
                            <DataGridContainer className="h-full">
                                <ScrollArea>
                                    <DataGridTree />
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </DataGridContainer>
                        </DataGrid>
                    </div>
                    <div>
                        <span className="text-black text-lg">FOOTER: {window_id}</span>
                    </div>
                </div>
            </Container>
        </Fragment>

    );
}