import { useParams } from "react-router";
import { Fragment } from "react";
import { Container } from "@/components/common/container";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';
import { DataGridTree } from "@/components/ui-custom/data-grid-tree";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea } from "@/components/ui/scroll-area";
const demoData = [
    {
        id: 0,
        name: "Công ty 0",
        position: "Tổng giám đốc",
    },
    {
        id: 1,
        name: "Công ty A",
        position: "Tổng giám đốc",
        children: [
            { id: 2, name: "Phòng Kinh doanh", position: "Trưởng phòng" },
            { id: 3, name: "Phòng Kế toán", position: "Trưởng phòng" },
        ],
    },
];
const columns = [
    { accessorKey: "name", header: "Tên đơn vị" },
    { accessorKey: "position", header: "Chức vụ" },
];
export function DashboardPage() {
    const { window_id } = useParams();
    const table = useReactTable({
        columns,
        data: demoData,
        getRowId: (row: IData) => row.id.toString(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Fragment>
            <Container className="flex flex-col h-full">
                <DataGrid table={table} recordCount={demoData?.length || 0}>
                    <div className="w-full space-y-2.5">
                        <DataGridContainer>
                            <ScrollArea>
                                <DataGridTree />
                            </ScrollArea>
                        </DataGridContainer>
                    </div>
                </DataGrid>
                <span className="text-black text-lg">Dashboard: {window_id}</span>
            </Container>
        </Fragment>
    );
}