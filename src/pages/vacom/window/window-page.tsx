import { useParams } from "react-router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import {
    getCoreRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    useReactTable,
    getExpandedRowModel,
    RowData,
    ColumnPinningState,
    PaginationState
} from '@tanstack/react-table';
import { DataGridTree } from "@/components/ui-custom/data-grid-tree";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWindowPage } from "../useWindowPage";
import HeaderWin from "../header-win";
import { IWinContext, WinContext } from "../win-context";
import { IColumnType, IContentView, IFilterVariant, ITypeEditor } from "../type";
import { SchemaForm } from "@/uiEngine/schema-form";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { VcGridPagination } from "@/components/ui-custom/vc-grid-pagination";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: IFilterVariant,
        typeEditor?: ITypeEditor,
        classCellName?: string,
        columnType?: IColumnType
    }
}

export function WindowPage() {
    const { window_id } = useParams();

    const getContentView = useCallback((config: IContentView) => {
        return <SchemaForm
            schema={config.schema}
            onAction={config.handleAction}
            values={config.values}
            valuesCheck={config.valueCheck}
        />;
    }, []);
    const { columns, data, itemSelected, permission,
        setItemSelected, onDoubleClick, onKeyDown, onContextMenu, handleAction, columnPinning: pinning } = useWindowPage({ window_id, getContentView, type: "window" });
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(pinning);

    useEffect(() => {
        setColumnPinning(pinning);
    }, [pinning])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        columns,
        data: data || [],
        getRowId: (row: IData) => row.id.toString(),
        getSubRows: (row: any) => row.children,
        columnResizeMode: 'onChange',
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
            columnPinning
        },
        onColumnFiltersChange: setColumnFilters,
        onColumnPinningChange: setColumnPinning,
        filterFromLeafRows: true,
        enableMultiRowSelection: false
    });

    const ctxWinValue = useMemo<IWinContext>(
        () => ({
            handleAction
        }),
        [handleAction]
    );

    return (
        <Fragment>
            <Container className="flex flex-col h-full">
                <WinContext.Provider value={ctxWinValue}>
                    <div className="flex flex-col h-full space-y-2.5">
                        <HeaderWin permission={permission} />
                        <div className="flex-1 min-h-0">
                            <DataGrid table={table} tableLayout={{ columnsPinnable: true, headerSticky: true, columnsResizable: true }}
                                autoFocus={true} onKeyDown={onKeyDown}
                                onRowClick={setItemSelected} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
                                recordCount={data?.length || 0}>
                                <DataGridContainer className="h-full">
                                    <ScrollArea>
                                        {/* <DataGridTable itemSelected={itemSelected} /> */}
                                        <DataGridTable />
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </DataGridContainer>
                            </DataGrid>
                        </div>
                        <div className="mb-4">
                            <VcGridPagination
                                pageIndex={1}
                                pageSize={10}
                                pageCount={100}
                                recordCount={100}
                                isLoading={false}
                                onPageChange={(newIndex) => { }}
                                onPageSizeChange={(newSize) => {

                                }}
                            />
                        </div>
                    </div>
                </WinContext.Provider>
            </Container>
        </Fragment>

    );
}