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
    ColumnDef,
    getSortedRowModel,
    getPaginationRowModel,
    ExpandedState,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWindowPage } from "../useWindowPage";
import HeaderWin from "../header-win";
import { IWinContext, WinContext } from "../win-context";
import { IColumnType, IContentView, IFilterVariant, ITypeEditor } from "../type";
import { SchemaForm } from "@/uiEngine/schema-form";
import { VcGridPagination } from "@/components/ui-custom/vc-grid-pagination";
import { VcDataGrid } from "@/components/ui-custom/vc-data-grid";
import { Button } from "@/components/ui/button";
import { SquareMinus, SquarePlus } from "lucide-react";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiQuery } from "@/api/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@/i18n/config";
import { useSettings } from "@/providers/settings-provider";
import { Column } from "react-aria-components";
import { Card, CardHeader, CardHeading, CardTable, CardToolbar } from "@/components/ui/card";

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
    const { columns, data, itemSelected, permission, isExpand, subTabs,
        setItemSelected, onDoubleClick, onKeyDown, onContextMenu, handleAction, columnPinning: pinning,
        infoPage, setInfoPage } = useWindowPage({ window_id, getContentView, type: "window" });
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(pinning);

    const [expandedRows, setExpandedRows] = useState<ExpandedState>({});

    useEffect(() => {
        setColumnPinning(pinning);
        setExpandedRows({});
    }, [pinning])

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const colExpand: ColumnDef<IData, any> = useMemo(() => {
        const [first, ...rest] = subTabs;
        return {
            id: 'expand',
            header: () => null,
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <Button onClick={row.getToggleExpandedHandler()} mode="icon" size="sm" variant="ghost">
                        {row.getIsExpanded() ? <SquareMinus /> : <SquarePlus />}
                    </Button>
                ) : <Button onClick={row.getToggleExpandedHandler()} mode="icon" size="sm" variant="ghost">
                    {row.getIsExpanded() ? <SquareMinus /> : <SquarePlus />}
                </Button>;
            },
            size: 37,
            enableResizing: false,
            meta: {
                expandedContent: (row) => <ItemsSubContent row={row} subTabs={rest} window_id={window_id ?? ''} />,
                cellClassName: 'p-1'
            },
        }
    }, [subTabs, window_id]);

    const table = useReactTable({
        columns: isExpand ? [colExpand, ...columns] : columns,
        data: data || [],
        getRowId: (row: IData) => row.id.toString(),
        getRowCanExpand: (row) => isExpand,
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
            columnPinning: isExpand ? { left: ['expand', ...(columnPinning.left || [])], right: columnPinning.right } : columnPinning,
            expanded: expandedRows,
        },
        onExpandedChange: setExpandedRows,
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

    const totalWidth = useMemo(() => {
        return columns.reduce((sum: number, col: any) => sum + (col?.size ?? 100), 0);
    }, [columns]);

    return (
        <Fragment>
            <Container className="flex flex-col h-full">
                <WinContext.Provider value={ctxWinValue}>
                    <div className="flex flex-col h-full space-y-2.5">
                        <HeaderWin permission={permission} />
                        <div className="flex-1 min-h-0">
                            <DataGrid table={table} tableLayout={{ columnsPinnable: true, headerSticky: true, columnsResizable: true }}
                                autoFocus={true} onKeyDown={onKeyDown} itemSelected={itemSelected}
                                onRowClick={setItemSelected} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
                                recordCount={data?.length || 0}>
                                <DataGridContainer className="h-full">
                                    <ScrollArea>
                                        <div style={{ width: totalWidth + 10 }}>
                                            <VcDataGrid />
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </DataGridContainer>
                            </DataGrid>
                        </div>
                        <div className="mb-4">
                            <VcGridPagination
                                pageIndex={infoPage.pageIndex}
                                pageSize={infoPage.pageSize}
                                recordCount={infoPage.recordCount}
                                isLoading={infoPage.isLoading}
                                onPageChange={(newIndex) => setInfoPage(prev => ({ ...prev, pageIndex: newIndex }))}
                                onPageSizeChange={(newSize) => setInfoPage(prev => ({ ...prev, pageIndex: 0, pageSize: newSize }))}
                            />
                        </div>
                    </div>
                </WinContext.Provider>
            </Container>
        </Fragment>

    );
}

const ItemsSubContent = ({ row, subTabs, window_id }: { row: IData, subTabs: IData[], window_id: string }) => {
    const _ = useT();
    const [activeTab, setActiveTab] = useState(subTabs[0]?.id);
    return (
        <div className="w-full p-2 bg-muted-foreground/10">
            <Tabs
                defaultValue={activeTab?.toString()}
                onValueChange={setActiveTab}
                className="h-full flex flex-col overflow-hidden"
            >
                <TabsList>
                    {subTabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id.toString()}>
                            {_(tab.TAB_NAME)}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {subTabs.map((tab) => (
                    <TabsContent
                        key={tab.id}
                        value={tab.id.toString()}
                        className="h-full"
                    >
                        <ItemsSubTable
                            rowId={row.id.toString()}
                            tab={tab}
                            isActive={tab.id === activeTab?.toString()}
                            window_id={window_id}
                        />
                    </TabsContent>
                ))}
                {/* <Card className="flex-1 flex flex-col overflow-hidden">
                    <CardHeader className="py-0 shrink-0">
                        <CardToolbar>
                            <TabsList>
                                {subTabs.map((tab) => (
                                    <TabsTrigger key={tab.id} value={tab.id.toString()}>
                                        {_(tab.TAB_NAME)}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </CardToolbar>
                    </CardHeader>
                    <div className="flex-1 overflow-auto">
                        {subTabs.map((tab) => (
                            <TabsContent
                                key={tab.id}
                                value={tab.id.toString()}
                                className="h-full"
                            >
                                <ItemsSubTable
                                    rowId={row.id.toString()}
                                    tab={tab}
                                    isActive={tab.id === activeTab?.toString()}
                                    window_id={window_id}
                                />
                            </TabsContent>
                        ))}
                    </div>
                </Card> */}
            </Tabs>
        </div>
    );
}

function ItemsSubTable({ rowId, tab, isActive, window_id }: { rowId: string, tab: IData, isActive: boolean, window_id: string }) {

    const queryKey = ['subTable', tab.TAB_ID];
    const { data, isLoading, isFetching, error } = useApiQuery<IData[]>(
        queryKey,
        {
            link: `/api/System/GetDataDetailsByTabTable?window_id=${window_id}&id=${rowId}&tab_table=${tab.TAB_TABLE}`,
            enabled: isActive && !!window_id,
        },

        { refetchOnWindowFocus: false }
    );

    const fixColumn = tab.columns.map((col: IData) => ({ ...col, meta: { ...col.meta, skeleton: <Skeleton className="w-full h-7" /> } }));

    const totalWidth = useMemo(() => {
        return tab.columns.reduce((sum: number, col: any) => sum + (col?.size ?? 100), 0);
    }, [tab.columns]);

    const table = useReactTable({
        data: data || [],
        columns: fixColumn,
        getCoreRowModel: getCoreRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        getRowId: (row: IData) => row.id?.toString(),
    });

    return (
        <div className="flex flex-col bg-muted/30" style={{ height: 400 }}>
            <div className="flex-1 min-h-0">
                <DataGrid
                    table={table}
                    recordCount={(data || []).length}
                    isLoading={isFetching}
                    tableLayout={{
                        // cellBorder: true,
                        // headerSticky: true, // lỗi bị đè lên header chính
                        rowBorder: true,
                        headerBackground: true,
                        headerBorder: true,
                    }}
                >
                    <DataGridContainer className="h-full bg-background">
                        <ScrollArea>
                            <div style={{ width: totalWidth + 10 }}>
                                {table.getRowModel().rows.length > 0 ? (
                                    <DataGridTable />
                                ) : (
                                    <div className="text-sm text-muted-foreground p-4">
                                        Không có dữ liệu
                                    </div>
                                )}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </DataGridContainer>
                </DataGrid>
            </div>
        </div>
    );
}