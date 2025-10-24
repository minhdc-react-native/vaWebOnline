import { useParams } from "react-router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/common/container";
import {
    getCoreRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    useReactTable,
    getExpandedRowModel,
    ColumnPinningState,
    ColumnDef,
    ExpandedState,
} from '@tanstack/react-table';
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWindowPage } from "../useWindowPage";
import HeaderWin from "../header-win";
import { IWinContext, WinContext } from "../win-context";
import { IColumnType, IContentView, ITypeEditor } from "../type";
import { SchemaForm } from "@/uiEngine/schema-form";
import { VcGridPagination } from "@/components/ui-custom/vc-grid-pagination";
import { VcDataGrid } from "@/components/ui-custom/vc-data-grid";
import { Button } from "@/components/ui/button";
import { SquareMinus, SquarePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiQuery } from "@/api/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/config";
import { VcDataGridVirtualizer } from "@/components/ui-custom/data-grid-virtualizer";
import { useMapSource } from "@/uiEngine/hooks/useMapSource";
import { formatDate, formatDateTime, formatNumber } from "@/lib/helpers";

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
        infoPage, setInfoPage, schema } = useWindowPage({ window_id, getContentView, type: "window" });
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(pinning);

    const { mapValueSource } = useMapSource({ source: schema.dataSource });

    const getValueCell = useCallback((value: any, typeEditor: ITypeEditor, columnType: IColumnType, refId: string | null) => {
        switch (typeEditor) {
            case 'autonumeric':
            case 'number':
                return formatNumber(value);
            case 'dateedit':
            case 'datepicker':
                return columnType === "VC_DATE" ? formatDate(value) : formatDateTime(value);
            case "combo":
            case "richselect":
                return refId ? mapValueSource[refId]?.get(value) : value;
            default:
                return value;
        }
    }, [mapValueSource]);

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

    const fixColumns = useMemo(() => {
        const cols = columns.map((f: ColumnDef<IData, any>) => ({
            ...f,
            cell: ({ getValue }: any) =>
                getValueCell(getValue(), f.meta?.typeEditor, f.meta?.columnType, f.meta?.refId ?? null)
        }));
        return isExpand ? [colExpand, ...cols] : cols;
    }, [isExpand, colExpand, columns, getValueCell]);

    const table = useReactTable({
        columns: fixColumns,
        data: data || [],
        getRowId: (row: IData) => row.id.toString(),
        getRowCanExpand: (row) => { return isExpand },
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
            handleAction,
            itemSelected: itemSelected!,
            window_id: window_id!,
            mapValueSource
        }),
        [handleAction, itemSelected, window_id, mapValueSource]
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
                className="h-full flex flex-col overflow-hidden gap-0"
            >
                <TabsList className="p-0 m-0 gap-0">
                    {subTabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id.toString()} className="border-1 border-b-0 rounded-bl-none rounded-br-none aria-[selected=true]:border-border aria-[selected=false]:border-transparent">
                            {_(tab.TAB_NAME)}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {subTabs.map((tab) => (
                    <TabsContent
                        key={tab.id}
                        value={tab.id.toString()}
                        className="h-full mt-0"
                    >
                        <ItemsSubTable
                            rowId={row.id.toString()}
                            tab={tab}
                            isActive={tab.id === activeTab?.toString()}
                            window_id={window_id}
                        />
                    </TabsContent>
                ))}
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

    const [itemSelected, setItemSelected] = useState<IData>();

    const onRowClick = useCallback((item: IData, index: number) => {
        setItemSelected(item);
    }, []);

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
                    itemSelected={itemSelected}
                    onRowClick={onRowClick}
                    tableLayout={{
                        // cellBorder: true,
                        // headerSticky: true, // lỗi bị đè lên header chính
                        columnsResizable: true,
                        rowBorder: true,
                        headerBackground: true,
                        headerBorder: true,
                    }}
                >
                    <DataGridContainer className="h-full bg-background rounded-tl-none">
                        <ScrollArea>
                            <div style={{ width: totalWidth + 10 }}>
                                <VcDataGridVirtualizer />
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </DataGridContainer>
                </DataGrid>
            </div>
        </div>
    );
}