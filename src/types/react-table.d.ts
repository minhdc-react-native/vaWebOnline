import {
    RowData
} from '@tanstack/react-table'
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: IFilterVariant,
        typeEditor?: ITypeEditor,
        classCellName?: string,
        columnType?: IColumnType
    }
}