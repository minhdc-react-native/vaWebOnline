import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CellContext, ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { useFormContext } from "react-hook-form";
import { api } from "@/api/apiMethods";
import { Button } from "@/components/ui/button";
import { Delete, Plus } from "lucide-react";
export interface ITabsProg {
    height?: number;
    valuesCheck: Record<string, any>;
    tabs: IData[];
}

export function ITabsField({ height, valuesCheck, tabs }: ITabsProg) {
    const { getValues } = useFormContext();

    return (
        <div style={{ height: height }} className={cn('flex flex-col w-full', !height && 'flex-1')}>
            <ItemsSubContent rowId={getValues('id')} subTabs={tabs} window_id={valuesCheck.window_id} />
        </div>
    );
}


const ItemsSubContent = ({ rowId, subTabs, window_id }: { rowId: string, subTabs: IData[], window_id: string }) => {
    const _ = useT();
    const [activeTab, setActiveTab] = useState(subTabs[0]?.id);
    return (
        <div className="flex-1 w-full p-2">
            <Tabs
                defaultValue={activeTab?.toString()}

                onValueChange={setActiveTab}
                className="h-full flex flex-col overflow-hidden gap-0"
            >
                <TabsList className="p-0 m-0 gap-0 bg-transparent">
                    {subTabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id.toString()} className="border-1 border-b-0 rounded-bl-none rounded-br-none aria-[selected=true]:border-border aria-[selected=false]:border-transparent">
                            {_(tab.TAB_NAME)}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {subTabs.map((tab) => (
                    <TabsContent
                        key={tab.id}
                        forceMount
                        value={tab.id.toString()}
                        className="flex flex-col flex-1 h-full mt-0 data-[state=inactive]:hidden"
                    >
                        <ItemsSubTable
                            rowId={rowId}
                            tab={tab}
                            window_id={window_id}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function useSkipper() {
    const shouldSkipRef = useRef(true)
    const shouldSkip = shouldSkipRef.current

    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
        shouldSkipRef.current = false
    }, [])

    useEffect(() => {
        shouldSkipRef.current = true
    })

    return [shouldSkip, skip] as const
}

function ItemsSubTable({ rowId, tab, window_id }: { rowId: string, tab: IData, window_id: string }) {

    const [data, setData] = useState<IData[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get({
            link: `/api/System/GetDataDetailsByTabTable?window_id=${window_id}&id=${rowId}&tab_table=${tab.TAB_TABLE}`,
            callBack: (res) => setData(res),
            setLoading
        })
    }, []);

    const defaultColumn: Partial<ColumnDef<IData>> = {
        cell: (props) => <EditableCell {...props} />
    }
    const fixColumn = tab.columns.map((col: IData) => ({
        ...col,
        meta: { ...col.meta, skeleton: <Skeleton className="w-full h-7" /> },
        cell: (props: any) => <EditableCell {...props} />
    }));

    const totalWidth = useMemo(() => {
        return tab.columns.reduce((sum: number, col: any) => sum + (col?.size ?? 100), 0);
    }, [tab.columns]);

    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const table = useReactTable({
        data: data || [],
        columns: fixColumn,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        getRowId: (row: IData) => row.id?.toString(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                // Skip page index reset until after next rerender
                skipAutoResetPageIndex()
                setData(old =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return row
                    })
                )
            },
        },
        debugTable: true
    });
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 min-h-0">
                <DataGrid
                    table={table}
                    recordCount={data.length}
                    isLoading={loading}
                    tableLayout={{
                        // cellBorder: true,
                        headerSticky: true,
                        rowBorder: true,
                        headerBackground: true,
                        headerBorder: true,
                    }}
                >
                    <ToolbarTableDetail />
                    <DataGridContainer className="flex-1 bg-background rounded-tl-none rounded-tr-none">
                        <ScrollArea>
                            <div style={{ width: totalWidth + 10 }}>
                                <DataGridTable />
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </DataGridContainer>
                </DataGrid>
            </div>
        </div>
    );
}

const ToolbarTableDetail = () => {
    const handleAction = (action: 'add' | 'delete') => {
        console.log('action>>', action);
    }
    return (
        <div className="gap-2 items-center p-1 border-1 border-border border-b-0 rounded-tr-lg">
            <Button type="button" variant="ghost" mode="icon" onClick={() => handleAction("add")}>
                <Plus className="text-green-900" />
            </Button>
            <Button type="button" variant="ghost" mode="icon" onClick={() => handleAction("delete")}>
                <Delete className="text-red-900" />
            </Button>
        </div>
    );
}

const EditableCell = React.memo(function EditableCell({ getValue, row: { index }, column: { id }, table }: CellContext<IData, unknown>) {
    const initialValue = getValue()
    const [value, setValue] = React.useState(initialValue)

    const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <input
            value={value as string}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            className="w-full p-1 border border-transparent focus:border-blue-500 focus:ring-0 outline-none rounded-sm"
        />
    )
})
