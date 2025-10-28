import { ITypeEditor } from "@/pages/vacom/type";
import { CellContext } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { InputEditor } from "./components/input-editor";
import { DateEditor } from "./components/date-editor";
import { CheckboxEditor } from "./components/checkbox-editor";
import { SelectEditor } from "./components/select-editor";
import { NumberEditor } from "./components/number-editor";
import { ColorEditor } from "./components/color-editor";
import { RatingEditor } from "./components/rating-editor";
import { useFormContext } from "@/uiEngine/hooks/useFormContext";
import { TextCellTable } from "./components/text-cell-table";
export function EditableCell({
    getValue,
    row: { index },
    column: { id, columnDef },
    table,
}: CellContext<IData, unknown>) {

    const initialValue = getValue();
    const [value, setValue] = React.useState<any>(initialValue);
    const { dataSource } = useFormContext();
    const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
    };
    const onChangeUpdate = (value: any) => {
        setValue(value);
        table.options.meta?.updateData(index, id, value);
    }
    const onUpdateExpression = (values: Record<string, any>) => {
        table.options.meta?.updateRow(index, values);
    }
    // Đồng bộ khi giá trị ban đầu thay đổi từ bên ngoài
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    const typeEditor: ITypeEditor = columnDef.meta?.typeEditor;

    if (columnDef.meta?.readonly) return <TextCellTable value={value} typeEditor={columnDef.meta.typeEditor} />

    switch (typeEditor) {
        case 'dateedit':
        case 'datepicker':
            return <DateEditor
                value={value}
                onChange={setValue}
                onBlur={onBlur}
            />
        case 'checkbox':
            return <CheckboxEditor
                value={value}
                onChange={onChangeUpdate}
            />
        case "combo":
        case "richselect":
        case "gridcombo":
        case "treeplus":
        case "gridplus":
        case "treesuggest":
            return <SelectEditor
                value={value}
                name={id}
                display={{ fDisplay: ['combo', 'rechselect'].includes(typeEditor) ? 'value' : 'id' }}
                columns={columnDef.meta?.listColumn || undefined}
                expression={columnDef.meta?.expression}
                onUpdate={onUpdateExpression}
                source={dataSource[columnDef.meta!.refId!]}
            />
        case "gridsuggest":
            return <SelectEditor
                value={value}
                name={id}
                display={{ fId: 'id' }}
                columns={columnDef.meta?.listColumn || undefined}
                expression={columnDef.meta?.expression}
                onUpdate={onUpdateExpression}
                source={{ url: `/api/System/GetDataByReferencesId?id=${columnDef.meta!.refId!}&filtervalue=#filterValue#`, keyFilter: '#filterValue#' }}
            />
        case "number":
        case "autonumeric":
            return <NumberEditor
                value={value}
                onChange={setValue}
                onBlur={onBlur}
            />
        case "colorpicker":
            return <ColorEditor
                value={value}
                onChange={setValue}
                onBlur={onBlur}
            />
        case "rating":
            return <RatingEditor
                value={value}
                onChange={setValue}
            />
        default:
            return <InputEditor
                value={value}
                onChange={setValue}
                onBlur={onBlur}
            />
    }

}