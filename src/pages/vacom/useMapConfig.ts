import { useCallback, useMemo } from "react";
import { IWindowConfig } from "./type"
import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@/i18n/config";

interface IProgs {
    windowConfig?: IWindowConfig
}
export const useMapConfig = ({ windowConfig }: IProgs) => {
    const _ = useT();
    const sortTreeNested = useCallback((data: IData[], codeField?: string): IData[] => {
        const grouped = new Map<string | null, IData[]>();
        data.forEach(item => {
            if (!grouped.has(item.parentId)) {
                grouped.set(item.parentId, []);
            }
            grouped.get(item.parentId)!.push(item);
        });
        if (codeField) {
            grouped.forEach(arr => {
                arr.sort((a, b) => {
                    const codeA = a[codeField] ?? "";
                    const codeB = b[codeField] ?? "";
                    return String(codeA).localeCompare(String(codeB));
                });
            });
        }
        const buildTree = (parentId: string | null): IData[] => {
            const children = grouped.get(parentId) || [];
            return children.map(child => ({
                ...child,
                children: buildTree(child.id.toString())
            }));
        };

        return buildTree(null);
    }, []);
    const columns = useMemo(() => {
        const tabMaster = windowConfig?.Tabs[0];
        if (!tabMaster) return []
        const fixColumns: ColumnDef<IData, any>[] = [];
        tabMaster.Fields
            .filter(f => !f.HIDE_IN_GRID)
            .map(f => {
                fixColumns.push({
                    accessorKey: f.COLUMN_NAME,
                    size: f.COLUMN_WIDTH || 350,
                    header: _(f.CAPTION || f.COLUMN_NAME), meta: {
                        filterVariant: f.TYPE_FILTER ? (f.TYPE_FILTER as any) : undefined,
                        headerClassName: "font-bold"
                    }
                })
            });
        return fixColumns;
    }, [_, windowConfig?.Tabs]);
    return {
        sortTreeNested,
        columns
    }
}