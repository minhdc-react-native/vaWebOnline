import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CellContext, ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Delete, Plus } from "lucide-react";
import { VcDataGrid } from "@/components/ui-custom/vc-data-grid";
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
                {subTabs.map((tab, idx) => (
                    <TabsContent
                        key={tab.id}
                        forceMount
                        value={tab.id.toString()}
                        className="flex flex-col flex-1 h-full mt-0 data-[state=inactive]:hidden"
                    >
                        <ItemsSubTable
                            rowId={rowId}
                            tab={tab}
                            tabIndex={idx}
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

function ItemsSubTable({ rowId, tab, tabIndex, window_id }: { rowId: string, tab: IData, tabIndex: number, window_id: string }) {
    const form = useFormContext();

    const [rows, setRows] = useState<IData[]>(form.getValues(`details.${tabIndex}.data`));


    const [itemSelected, setItemSelected] = useState<IData>();
    const defaultColumn: Partial<ColumnDef<IData>> = {
        cell: (props) => <EditableCell {...props} setItemSelected={setItemSelected} itemSelected={itemSelected} />
    }
    const fixColumn = tab.columns.map((col: IData) => ({
        ...col,
        meta: { ...col.meta, cellClassName: 'py-0 px-2' },
        // cell: (props: any) => <EditableCell {...props} setItemSelected={setItemSelected} itemSelected={itemSelected} />
    }));

    const totalWidth = useMemo(() => {
        return tab.columns.reduce((sum: number, col: any) => sum + (col?.size ?? 100), 0);
    }, [tab.columns]);
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const currentIdx = useMemo(() => {
        return rows.findIndex(item => (item as any).rowId === itemSelected?.rowId);
    }, [rows, itemSelected]);

    const onRowClick = useCallback((item: IData, index: number) => {
        setItemSelected(item);
    }, []);
    const handleAction = (action: 'add' | 'delete') => {
        switch (action) {
            case "add":
                const newItem = { ...tab.defaultValues, rowId: crypto.randomUUID() };
                setRows(prev => [...prev, newItem]);
                setItemSelected(newItem);
                break;
            case "delete":
                if (currentIdx !== undefined) {
                    const rowAfter = rows.filter((item, idx) => idx !== currentIdx);
                    setRows(rowAfter);
                    if (rowAfter.length > 0) {
                        const newSelectIdx = rowAfter.length - 1;
                        setItemSelected(rowAfter[newSelectIdx]);
                    }
                }
                break;
            default:
                break;
        }
    }
    const table = useReactTable({
        data: rows || [],
        columns: fixColumn,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        getRowId: (row: IData) => row.id?.toString(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                skipAutoResetPageIndex();
                setRows(prev => {
                    const newRows = [...prev];
                    newRows[rowIndex] = { ...newRows[rowIndex], [columnId]: value };
                    return newRows;
                });
                form.setValue(`details.${tabIndex}.data.${rowIndex}.${columnId}`, value, { shouldDirty: true });
            },
        },
        debugTable: true
    });
    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 min-h-0">
                <DataGrid
                    table={table}
                    recordCount={rows.length}
                    itemSelected={itemSelected}
                    onRowClick={onRowClick}
                    // isLoading={loading}
                    tableLayout={{
                        // cellBorder: true,
                        headerSticky: true,
                        rowBorder: true,
                        headerBackground: true,
                        headerBorder: true,
                    }}
                // tableClassNames={{
                //     bodyRow: 'py-0'
                // }}
                >
                    <ToolbarTableDetail handleAction={handleAction} />
                    <DataGridContainer className="flex-1 bg-background rounded-tl-none rounded-tr-none">
                        <ScrollArea>
                            <div style={{ width: totalWidth + 10 }}>
                                <VcDataGrid />
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </DataGridContainer>
                </DataGrid>
            </div>
        </div>
    );
}

const ToolbarTableDetail = ({ handleAction }: { handleAction: (action: 'add' | 'delete') => void }) => {
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

interface EditableCellProps extends CellContext<IData, unknown> {
    itemSelected?: IData,
    setItemSelected?: (item: IData) => void;
}

const EditableCell = React.memo(function EditableCell({
    getValue,
    row: { index, original },
    column: { id },
    table,
    itemSelected,
    setItemSelected,
}: EditableCellProps) {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
    };

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onFocus = React.useCallback(() => {
        if (setItemSelected && itemSelected?.id !== original.id) setItemSelected(original);
    }, [itemSelected, setItemSelected, original]);

    return (
        <input
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            className="w-full focus:bg-background px-2 py-1 border border-transparent focus:border-border focus:ring-0 outline-none rounded-sm"
        />
    );
});