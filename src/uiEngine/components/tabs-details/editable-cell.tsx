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
    // Đồng bộ khi giá trị ban đầu thay đổi từ bên ngoài
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    const typeEditor: ITypeEditor = columnDef.meta?.typeEditor;
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
                onChange={onChangeUpdate}
                display={{ fDisplay: ['combo', 'rechselect'].includes(typeEditor) ? 'value' : 'id' }}
                columns={columnDef.meta?.listColumn || undefined}
                source={dataSource[columnDef.meta!.refId!]}
            />
        case "gridsuggest":
            return <SelectEditor
                value={value}
                onChange={onChangeUpdate}
                display={{ fId: 'id' }}
                columns={columnDef.meta?.listColumn || undefined}
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
                onBlur={onBlur}
            />
        default:
            return <InputEditor
                value={value}
                onChange={setValue}
                onBlur={onBlur}
            />
    }

}