import { useCallback, useMemo } from "react";
import { IColumnType, IFieldConfig, ITypeEditor, IWindowConfig } from "./type"
import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@/i18n/config";
import { formatDate, formatDateTime, formatNumber } from "@/lib/helpers";
import { IFieldAll, IFormSchema } from "@/uiEngine/interface";

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
    const getCellClassName = useCallback((typeEditor: ITypeEditor) => {
        switch (typeEditor) {
            case 'autonumeric':
            case 'number':
                return 'text-right';
            case 'dateedit':
            case 'datepicker':
                return 'text-center'
            default:
                return 'truncate';
        }
    }, []);

    const getValueCell = useCallback((value: any, typeEditor: ITypeEditor, columnType: IColumnType) => {
        switch (typeEditor) {
            case 'autonumeric':
            case 'number':
                return formatNumber(value);
            case 'dateedit':
            case 'datepicker':
                return columnType === "VC_DATE" ? formatDate(value) : formatDateTime(value);
            default:
                return value;
        }
    }, [])
    const columns = useMemo(() => {
        const tabMaster = windowConfig?.Tabs[0];
        if (!tabMaster) return []
        const fixColumns: ColumnDef<IData, any>[] = [];
        tabMaster.Fields
            .filter(f => !f.HIDE_IN_GRID)
            .map(f => {
                fixColumns.push({
                    accessorKey: f.COLUMN_NAME,
                    cell: ({ getValue }) => getValueCell(getValue(), (f.TYPE_EDITOR as any), (f.COLUMN_TYPE as any)),
                    size: f.COLUMN_WIDTH || 350,
                    header: _(f.CAPTION || f.COLUMN_NAME),
                    meta: {
                        filterVariant: f.TYPE_FILTER ? (f.TYPE_FILTER as any) : undefined,
                        typeEditor: (f.TYPE_EDITOR as any),
                        columnType: (f.COLUMN_TYPE as any),
                        classCellName: getCellClassName((f.TYPE_EDITOR as any)),
                        headerClassName: "font-bold",
                    }
                })
            });
        return fixColumns;
    }, [_, windowConfig?.Tabs, getCellClassName, getValueCell]);

    const schemaWin: {
        schema: IFormSchema,
        width?: number | null;
        defaultValues?: Record<string, any>,
        dataSource?: string[],
    } = useMemo(() => {
        const fieldMaster = windowConfig?.Tabs[0].Fields || [];
        const defaultValue: Record<string, any> = {};
        const dataSource: string[] = [];
        const newFieldMaster = fieldMaster.filter(f => !f.HIDDEN).reduce((acc, item) => {
            const row = item.ROW ?? 1;
            if (!acc[row]) acc[row] = [];
            acc[row].push(item);

            if (['combo', 'richselect', 'gridcombo', 'treeplus', 'gridplus', 'treesuggest'].includes(item.TYPE_EDITOR) && item.REF_ID) dataSource.push(item.REF_ID);

            return acc;
        }, {} as Record<number, IFieldConfig[]>);
        const layout: IFieldAll[] = Object.values(newFieldMaster).map((items): IFieldAll => {
            if (items.length === 1) return getConfigView(items[0]);
            return { type: 'group', layout: "flex", direction: "row", children: items.map((_item): IFieldAll => getConfigView(_item)) };
        });
        // push button
        layout.push({
            type: "group",
            layout: "flex",
            direction: "row",
            className: "justify-end",
            children: [
                { type: "empty", span: 1 },
                { type: "button", variant: "secondary", appearance: "ghost", label: "HUY", hotkey: "ESC", handleClick: 'onCancel' },
                { type: "button", variant: "primary", label: "SAVE", hotkey: "F10", buttonType: "submit", handleClick: 'onSubmit' }
            ]
        })
        return {
            schema: {
                type: "group",
                layout: "flex",
                children: layout
            },
            width: windowConfig?.WIDTH,
            defaultValue, dataSource
        }
    }, [windowConfig])

    return {
        sortTreeNested,
        columns,
        schemaWin
    }
}
const mapFieldType = {
    text: 'input',
    textarea: 'textarea',
    dateedit: 'date',
    datepicker: 'date'
}

const getConfigView = (field: IFieldConfig): IFieldAll => {
    const labelPosition: "top" | "left" | "right" = ['top', 'left', 'right'].includes(field.LABEL_POSITION as string) ? (field.LABEL_POSITION as any) : 'left';
    const listColumn = (field.LIST_COLUMN ? JSON.parse(field.LIST_COLUMN).filter((col: IData) => !col.hidden) : undefined);

    switch (field.TYPE_EDITOR) {
        case "text":
        case "textarea":
        case 'dateedit':
        case 'datepicker':
            return {
                type: "field",
                fieldType: (mapFieldType[field.TYPE_EDITOR] as any),
                label: (field.CAPTION_FIELD || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined
            };
        case "combo":
        case "richselect":
        case "gridcombo":
        case "treeplus":
        case "gridplus":
        case "treesuggest":
            return {
                type: "select",
                keySource: field.REF_ID ?? undefined,
                label: (field.CAPTION_FIELD || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                columns: listColumn
            }
        default:
            return {
                type: "field",
                fieldType: "input",
                label: (field.CAPTION_FIELD || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined
            };
    }
}