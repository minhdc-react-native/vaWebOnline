import { useParams } from "react-router";
import { Fragment, useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import {
    getCoreRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    useReactTable,
    getExpandedRowModel,
    RowData,
} from '@tanstack/react-table';
import { DataGridTree } from "@/components/ui-custom/data-grid-tree";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTreeWindow } from "./useTreeWindow";
import HeaderWin from "../header-win";
import { IWinContext, WinContext } from "../win-context";

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'textFilter' | 'serverFilter' | 'selectFilter' | 'numberFilter' | 'datepickerFilter' | 'serverDateRangeFilter' |
        'serverSelectFilter' | 'serverNumericFilter' | 'checkboxFilter'
    }
}

export function TreeWindowPage() {
    const { window_id } = useParams();
    const { windowConfig, columns, data, onRefresh, itemSelected, permission,
        setItemSelected, onDoubleClick, onContextMenu } = useTreeWindow({ window_id })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        columns,
        data: data || [],
        getRowId: (row: IData) => row.id.toString(),
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
        filterFromLeafRows: true,
        enableMultiRowSelection: false
    });

    const ctxWinValue = useMemo<IWinContext>(
        () => ({
            handleAction: (action) => {
                switch (action) {
                    case 'onRefresh':
                        onRefresh();
                        break;

                    default:
                        break;
                }
            }
        }),
        [onRefresh]
    );

    return (
        <Fragment>
            <Container className="flex flex-col h-full">
                <WinContext.Provider value={ctxWinValue}>
                    <div className="flex flex-col h-full space-y-2.5">
                        <HeaderWin permission={permission} />
                        <div className="flex-1 min-h-0">
                            <DataGrid table={table} tableLayout={{ headerSticky: true }}
                                onRowClick={setItemSelected} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
                                recordCount={data?.length || 0}>
                                <DataGridContainer className="h-full">
                                    <ScrollArea>
                                        <DataGridTree itemSelected={itemSelected} />
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </DataGridContainer>
                            </DataGrid>
                        </div>
                        <div>
                            <span className="text-black text-lg">FOOTER: {window_id}</span>
                        </div>
                    </div>
                </WinContext.Provider>
            </Container>
        </Fragment>

    );
}