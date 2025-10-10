interface IFieldConfig {
    id: string;
    ROW: number | null;
    COL: number | null;
    HIDDEN: boolean;
    COLUMN_NAME: string;
    CAPTION: string | null;
    CAPTION_FIELD: string | null;
    TYPE_EDITOR: string;
    GRAVITY: number | null;
    PLACEHOLDER: string | null;
    SPACE: string | null;
    VALID_RULE: string | null;
    FORMAT: string | null;
    LABEL_POSITION: string | null;
    LABEL_WIDTH: number | null;
    DEFAULT_VALUE: string | null;
    WIDTH: number | null;
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