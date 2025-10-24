import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";
import { DataGridEdit } from "./data-grid-edit";
export interface ITabsProg {
    height?: number;
    valuesCheck: Record<string, any>;
    tabs: IData[];
    className?: string;
}

export function ITabsField({ height, valuesCheck, tabs, className }: ITabsProg) {
    const { getValues } = useFormContext();

    return (
        <div
            style={{ height: height ? Math.max(height, 250) : undefined }}
            className={cn('flex flex-col max-w-full', !height && 'flex-1 min-h-0', className)}
        >
            <ItemsSubContent
                rowId={getValues('id')}
                subTabs={tabs}
                window_id={valuesCheck.window_id}
            />
        </div>
    );
}

const ItemsSubContent = ({ rowId, subTabs, window_id }: { rowId: string, subTabs: IData[], window_id: string }) => {
    const _ = useT();
    const [activeTab, setActiveTab] = useState(subTabs[0]?.id);

    return (
        <div className="flex-1 min-h-0 max-w-full p-2">
            <Tabs
                defaultValue={activeTab?.toString()}
                onValueChange={setActiveTab}
                className="h-full flex flex-col overflow-hidden gap-0"
            >
                <TabsList className="p-0 m-0 gap-0 bg-transparent">
                    {subTabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id.toString()}
                            className="border-1 border-b-0 rounded-bl-none rounded-br-none aria-[selected=true]:border-border aria-[selected=false]:border-transparent"
                        >
                            {_(tab.TAB_NAME)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {subTabs.map((tab, idx) => (
                    <TabsContent
                        key={tab.id}
                        forceMount
                        value={tab.id.toString()}
                        className="flex flex-col flex-1 min-h-0 mt-0 max-w-full overflow-auto data-[state=inactive]:hidden"
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
};


function ItemsSubTable({ rowId, tab, tabIndex, window_id }: { rowId: string, tab: IData, tabIndex: number, window_id: string }) {
    const form = useFormContext();

    const [rows, setRows] = useState<IData[]>(form.getValues(`details.${tabIndex}.data`));
    const updateData = (rowIndex: number, columnId: string, value: unknown) => {

    }
    return (
        <DataGridEdit data={rows} columns={tab.columns} updateData={updateData} />
    );
}
