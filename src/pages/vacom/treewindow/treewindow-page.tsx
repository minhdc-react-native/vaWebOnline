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
    VisibilityState,
    ColumnDef
} from '@tanstack/react-table';
import { DataGridTree } from "@/components/ui-custom/data-grid-tree";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWindowPage } from "../useWindowPage";
import HeaderWin from "../header-win";
import { IWinContext, WinContext } from "../win-context";
import { IContentView } from "../type";
import { SchemaForm } from "@/uiEngine/schema-form";
import { useMapSource } from "@/uiEngine/hooks/useMapSource";

export function TreeWindowPage() {
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
        setItemSelected, onDoubleClick, onKeyDown, onContextMenu, handleAction, columnPinning: pinning, schema, columnVisibility: colVisible } = useWindowPage({ window_id, getContentView, type: "tree" });

    const { mapValueSource } = useMapSource({ source: schema.dataSource });

    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(pinning);

    useEffect(() => {
        setColumnPinning(pinning);
    }, [pinning])
    useEffect(() => {
        setColumnVisibility(colVisible);
    }, [colVisible])

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(colVisible);
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
            columnPinning,
            columnVisibility
        },
        onColumnFiltersChange: setColumnFilters,
        onColumnPinningChange: setColumnPinning,
        onColumnVisibilityChange: setColumnVisibility,
        filterFromLeafRows: true,
        enableMultiRowSelection: false
    });

    const totalWidth = useMemo(() => {
        return columns.filter((c: IData) => columnVisibility[c.accessorKey!] !== false).reduce((sum: number, col: any) => sum + (col?.size ?? 100), 0);
    }, [columns, columnVisibility]);

    const ctxWinValue = useMemo<IWinContext>(
        () => ({
            handleAction,
            itemSelected: itemSelected!,
            window_id: window_id!,
            mapValueSource
        }),
        [handleAction, itemSelected, window_id, mapValueSource]
    );

    return (
        <Fragment>
            <Container className="flex flex-col h-full">
                <WinContext.Provider value={ctxWinValue}>
                    <div className="flex flex-col h-full space-y-2.5 pb-5">
                        <HeaderWin permission={permission} table={table} />
                        <div className="flex-1 min-h-0">
                            <DataGrid table={table} tableLayout={{ columnsPinnable: true, headerSticky: true, columnsResizable: true }}
                                autoFocus={true} onKeyDown={onKeyDown} itemSelected={itemSelected}
                                onRowClick={setItemSelected} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
                                recordCount={data?.length || 0}>
                                <DataGridContainer className="h-full">
                                    <ScrollArea>
                                        <div style={{ width: totalWidth + 10 }}>
                                            <DataGridTree />
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </DataGridContainer>
                            </DataGrid>
                        </div>
                    </div>
                </WinContext.Provider>
            </Container>
        </Fragment>
    );
}