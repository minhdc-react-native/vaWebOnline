import { IFormSchema } from "@/uiEngine/interface";

export interface IFieldConfig {
    id: string;
    ROW: number | null;
    COL: number | null;
    HIDDEN: boolean;
    HIDE_IN_GRID: boolean;
    COLUMN_NAME: string;
    CAPTION: string | null;
    CAPTION_FIELD: string | null;
    TYPE_EDITOR: ITypeEditor;
    COLUMN_TYPE: IColumnType;
    GRAVITY: number | null;
    PLACEHOLDER: string | null;
    SPACE: string | null;
    VALID_RULE: string | null;
    FORMAT: string | null;
    LABEL_POSITION: string | null;
    LABEL_WIDTH: number | null;
    DEFAULT_VALUE: string | null;
    WIDTH: number | null;
    COLUMN_WIDTH: number | null;
    TYPE_FILTER: string | null;
    REF_ID: string | null;
    LIST_COLUMN: string | null;
    FIELD_EXPRESSION: string | null;
}
interface ITabConfig {
    id: string;
    HIDDEN: boolean;
    TAB_ID: string;
    TAB_NAME: string;
    INSERT_STORE_PROCEDURE: string | null;
    UPDATE_STORE_PROCEDURE: string | null;
    DELETE_STORE_PROCEDURE: string | null;
    Fields: IFieldConfig[]
}
export interface IWindowConfig {
    id: string;
    WINDOW_ID: string;
    WINDOW_NAME: string;
    MA_CT: string | null;
    WIDTH: number | null;
    URL_HELP: string | null;
    URL_VIDEO: string | null;
    Tabs: ITabConfig[]
}

export interface IContentView {
    schema: IFormSchema;
    handleAction: (action: string, values?: Record<string, any>) => void;
    values: Record<string, any>;
    valueCheck?: Record<string, any>;
}

export type IFilterVariant = 'textFilter' | 'serverFilter' | 'selectFilter' | 'numberFilter' | 'datepickerFilter' | 'serverDateRangeFilter' |
    'serverSelectFilter' | 'serverNumericFilter' | 'checkboxFilter';
export type ITypeEditor = 'text' | 'combo' | 'richselect' | 'checkbox' | 'datepicker' | 'autonumeric' | 'treesuggest' | 'gridsuggest' |
    'gridcombo' | 'textarea' | 'radio' | 'multiselect' | 'dateedit' | 'treeplus' | 'gridplus' | 'reftemp' | 'list_time' | 'colorpicker' | 'rating' |
    'password' | 'number' | 'ckeditor' | 'linkedit' | 'template';
export type IColumnType = 'VC_BIT' | 'VC_CHAR' | 'VC_CODE' | 'VC_CODE_LG' | 'VC_CODE_SM' | 'VC_CODE_XS' | 'VC_DATE' | 'VC_DATETIME' | 'VC_DAY' |
    'VC_DONGIA' | 'VC_ID_GUI' | 'VC_INFO' | 'VC_INFO_LG' | 'VC_INFO_SM' | 'VC_INFO_XS' | 'VC_INT' | 'VC_MONTH' | 'VC_PT' | 'VC_REC' | 'VC_SMALLINT' | 'VC_SOLUONG' |
    'VC_TIEN' | 'VC_TINYINT' | 'VC_TYGIA' | 'VC_YEAR'        