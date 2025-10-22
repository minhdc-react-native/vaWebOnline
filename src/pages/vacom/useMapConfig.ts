import { useCallback, useMemo } from "react";
import { IColumnType, IFieldConfig, ITabConfig, ITypeEditor, IWindowConfig } from "./type"
import { ColumnDef } from "@tanstack/react-table";
import { useT } from "@/i18n/config";
import { formatDate, formatDateTime, formatNumber, isNotEmpty, safeJsonParse } from "@/lib/helpers";
import { IDataSource, IFieldAll, IFormSchema } from "@/uiEngine/interface";
import { useAuth } from "@/auth/context/auth-context";

const TYPE_NUMBER = ['VC_SOLUONG', 'VC_DONGIA', 'VC_TIEN', 'VC_INT', 'VC_MONTH', 'VC_DAY', 'VC_PT', 'VC_SMALLINT', 'VC_TINYINT', 'VC_TYGIA'];

interface IProgs {
    windowConfig?: IWindowConfig
}
export const useMapConfig = ({ windowConfig }: IProgs) => {
    const _ = useT();

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
    }, []);
    const getColumnConfig = useCallback((tab: ITabConfig, isMaster: boolean): IData => {
        const defaultValues: Record<string, any> = {};
        const mapValue: Record<string, any> = {
            DVCS_ID: infoDvcs?.DVCS_ID,
            NAM: currentYear
        }
        tab.Fields.map(item => {
            if (mapValue[item.COLUMN_NAME]) defaultValues[item.COLUMN_NAME] = mapValue[item.COLUMN_NAME];
            if (isNotEmpty(item.DEFAULT_VALUE) && (item.DEFAULT_VALUE as string).startsWith('@Default=')) {
                const valueDefault = (item.DEFAULT_VALUE as string).replace('@Default=', '').trim();
                defaultValues[item.COLUMN_NAME] = (TYPE_NUMBER.includes(item.COLUMN_TYPE) ? Number(valueDefault) : valueDefault);
            } else {
                if (!isMaster) {
                    defaultValues[item.COLUMN_NAME] = null;
                }
            }
        });
        const fixColumns: ColumnDef<IData, any>[] = [
            // {
            //     id: 'index',
            //     header: '#',
            //     cell: ({ row }) => row.index + 1,
            //     size: 50,
            //     meta: {
            //         cellClassName: 'bg-muted/40 text-right'
            //     }
            // }
        ];
        tab.Fields
            .filter(f => !f.HIDE_IN_GRID)
            .map(f => {
                fixColumns.push({
                    accessorKey: f.COLUMN_NAME,
                    cell: ({ getValue }) => getValueCell(getValue(), (f.TYPE_EDITOR as any), (f.COLUMN_TYPE as any)),
                    size: f.COLUMN_WIDTH || 400,
                    header: _(f.CAPTION || f.COLUMN_NAME),
                    meta: {
                        filterVariant: f.TYPE_FILTER ? (f.TYPE_FILTER as any) : undefined,
                        typeEditor: (f.TYPE_EDITOR as any),
                        columnType: (f.COLUMN_TYPE as any),
                        classCellName: getCellClassName((f.TYPE_EDITOR as any)),
                        headerClassName: "font-bold"
                    }
                })
            });
        return {
            id: tab.id,
            TAB_ID: tab.TAB_ID,
            TAB_NAME: tab.TAB_NAME,
            HIDDEN: !!tab.HIDDEN,
            WINDOW_ID: windowConfig?.WINDOW_ID,
            TAB_TABLE: tab.TAB_TABLE,
            columns: fixColumns,
            defaultValues
        };
    }, [windowConfig?.WINDOW_ID])

    const { currentYear, infoDvcs } = useAuth();

    const schemaWin: {
        schema: IFormSchema,
        schemaDelete: IFormSchema,
        width?: number | null;
        defaultValues?: Record<string, any>,
        columnPinning?: { left: string[], right: string[] };
        subTabs: IData[]
    } = useMemo(() => {
        const tabAll: ITabConfig[] = windowConfig?.Tabs || [];
        const subTabs: IData[] = [];
        for (let index = 0; index < tabAll.length; index++) {
            subTabs.push(getColumnConfig(tabAll[index], index === 0));
        }
        const fieldMaster = tabAll?.[0]?.Fields || [];
        const pinning = { left: tabAll?.[0]?.LEFTSPLIT ?? 0, right: tabAll?.[0]?.RIGHTSPLIT ?? 0 }
        const dataSource: IDataSource = {};
        const columnPinning: any = { left: [], right: [] };

        const fieldMasterShow = fieldMaster.filter(f => !f.HIDDEN);
        for (let i = 0; i < pinning.left; i++) {
            // columnPinning.left.push(fieldMasterShow[i].COLUMN_NAME)
        }
        const lenArr = fieldMasterShow.length;
        for (let i = 0; i < pinning.right; i++) {
            // columnPinning.right.push(fieldMasterShow[lenArr - i].COLUMN_NAME)
        }
        const newFieldMaster = fieldMasterShow.reduce((acc, item) => {
            const row = item.ROW ?? 1;
            if (!acc[row]) acc[row] = [];
            acc[row].push(item);

            if (['combo', 'richselect', 'gridcombo', 'treeplus', 'gridplus', 'treesuggest', 'multiselect'].includes(item.TYPE_EDITOR) && item.REF_ID) {
                dataSource[item.REF_ID] = { url: `/api/System/GetDataByReferencesId?id=${item.REF_ID}`, typeView: item.TYPE_EDITOR.startsWith('tree') ? 'tree' : 'table' };
            }

            return acc;
        }, {} as Record<number, IFieldConfig[]>);
        let isInsertTabsDetail = false;
        const layout = Object.values(newFieldMaster).reduce((acc, items, idx) => {
            if (windowConfig?.ROW_TAB && subTabs.length > 1 && windowConfig?.ROW_TAB < idx - 1) {
                acc.push({
                    type: "tabs",
                    height: windowConfig?.HEIGHT || undefined,
                    tabs: [...subTabs].slice(1)
                });
                isInsertTabsDetail = true;
            }
            if (items.length === 1) {
                acc.push(getConfigView(items[0]));
            } else {
                acc.push({
                    type: 'group', layout: "flex", direction: "row",
                    children: items.map((_item): IFieldAll => getConfigView(_item, _item.GRAVITY ?? 1))
                })
            }
            return acc;
        }, [] as IFieldAll[]);
        if (!isInsertTabsDetail && subTabs.length > 1) {
            layout.push({
                type: "tabs",
                height: windowConfig?.HEIGHT ? windowConfig?.HEIGHT + 50 : undefined,
                tabs: [...subTabs].slice(1)
            });
        }
        layout.push({ type: "line" })
        layout.push({
            type: "group",
            layout: "flex",
            direction: "row",
            children: [
                { type: "empty", span: 1 },
                { type: "button", variant: "secondary", appearance: "ghost", label: "HUY", hotkey: "ESC", handleClick: 'onCancel' },
                { type: "button", variant: "primary", label: "SAVE", hotkey: "F10", handleClick: 'onSubmit', isProcessing: true }
            ]
        });
        return {
            schema: {
                type: "group",
                layout: "flex",
                className: 'h-full flex-1',
                children: layout,
                dataSource: dataSource
            },
            schemaDelete: {
                type: "group",
                layout: "flex",
                children: [
                    {
                        type: "alert",
                        close: false,
                        icon: { name: "alert-circle", className: 'text-primary' },
                        titleContent: `Bạn phải cẩn thật trước khi <strong>Xoá</strong>`
                    },
                    {
                        type: "text",
                        className: 'text-center py-5',
                        content: _('MUON_XOA')
                    },
                    { type: "line" },
                    {
                        type: "group",
                        layout: "flex",
                        direction: "row",
                        children: [
                            { type: "empty", span: 1 },
                            { type: "button", variant: "secondary", appearance: "ghost", label: "KHONG", handleClick: 'onCancel' },
                            { type: "button", variant: "primary", label: "CO", buttonType: "submit", handleClick: 'onSubmit', isProcessing: true }
                        ]
                    }
                ]
            },
            width: windowConfig?.WIDTH,
            defaultValues: subTabs[0]?.defaultValues || {},
            columnPinning,
            subTabs
        }
    }, [windowConfig?.Tabs, windowConfig?.WIDTH, windowConfig?.ROW_TAB, windowConfig?.HEIGHT])

    const columns = useMemo(() => {
        return schemaWin.subTabs?.[0]?.columns || [];;
    }, [schemaWin.subTabs]);
    return {
        columns: columns,
        schemaWin,
        isExpand: (schemaWin.subTabs || []).length > 1
    }
}
const mapFieldType = {
    text: 'input',
    textarea: 'textarea',
    dateedit: 'date',
    datepicker: 'date',
    checkbox: 'checkbox'
}

const getConfigView = (field: IFieldConfig, span?: number): IFieldAll => {
    const labelPosition: "top" | "left" | "right" = ['top', 'left', 'right'].includes(field.LABEL_POSITION as string) ? (field.LABEL_POSITION as any) : 'left';
    const jsonListColumn = field.LIST_COLUMN ? safeJsonParse(field.LIST_COLUMN, []) : undefined;
    const listColumn = (jsonListColumn && jsonListColumn.length > 0 ? jsonListColumn.filter((col: IData) => !col.hidden) : undefined);
    const required = ['isNotEmpty', 'isFieldCode'].includes(field.VALID_RULE ?? "***");
    const expression: Record<string, any> = {};
    const param: any[] = field.FIELD_EXPRESSION?.split(';') || [];
    const disabled = !!field.READONLY?.includes('C');
    param.forEach(p => {
        const [fValue, fParam, isNotReplace] = p.replace(/[{}]/g, "").split(":");
        expression[fParam] = fValue;
    });

    switch (field.TYPE_EDITOR) {
        case "text":
        case "textarea":
        case 'dateedit':
        case 'datepicker':
        case 'checkbox':
            return {
                type: "field",
                fieldType: (mapFieldType[field.TYPE_EDITOR] as any),
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                checkType: field.COLUMN_TYPE === "VC_CHAR" ? "string" : (field.COLUMN_TYPE === "VC_BIT" ? undefined : "number"),
                labelWidth: field.LABEL_WIDTH ?? undefined,
                width: field.WIDTH ?? undefined,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
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
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                display: { fDisplay: field.DISPLAY_FIELD || (['combo', 'richselect'].includes(field.TYPE_EDITOR) ? 'value' : 'id') },
                width: field.WIDTH ?? undefined,
                columns: listColumn,
                expression: expression,
                cleanable: true,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
            }
        case "gridsuggest":
            return {
                type: "select",
                source: { url: `/api/System/GetDataByReferencesId?id=${field.REF_ID}&filtervalue=#filterValue#`, keyFilter: '#filterValue#' },
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                display: { fDisplay: field.DISPLAY_FIELD || (['combo', 'richselect'].includes(field.TYPE_EDITOR) ? 'value' : 'id') },
                width: field.WIDTH ?? undefined,
                columns: listColumn,
                expression: expression,
                cleanable: true,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
            }
        case "multiselect":
            return {
                type: "multiselect",
                keySource: field.REF_ID ?? undefined,
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                display: { fDisplay: field.DISPLAY_FIELD || 'value' },
                width: field.WIDTH ?? undefined,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
            }
        case "number":
        case "autonumeric":
            return {
                type: "number",
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                width: field.WIDTH ?? undefined,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
            }
        case "colorpicker":
            return {
                type: "color",
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                width: field.WIDTH ?? undefined,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
            };
        case "rating":
            return {
                type: "rating",
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                width: field.WIDTH ?? undefined,
                rules: { required: required },
                conditions: { disabled: disabled },
                span,
                maxStar: Number(field.DECIMAL_SIZE) ?? undefined
            };
        default:
            return {
                type: "field",
                fieldType: "input",
                label: (field.CAPTION_FIELD || field.CAPTION || field.COLUMN_NAME),
                name: field.COLUMN_NAME,
                labelPosition: labelPosition,
                labelWidth: field.LABEL_WIDTH ?? undefined,
                width: field.WIDTH ?? undefined,
                rules: { required: required },
                conditions: { disabled: disabled },
                span
            };
    }
}