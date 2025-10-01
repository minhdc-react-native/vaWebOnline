import { IconName } from "lucide-react/dynamic";

export type IFieldType =
    | "input"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "date"

export type IButtonType = "submit" | "reset" | "button";

export interface IFieldSchema {
    type: "field";
    name: string;
    label?: string;
    fieldType: IFieldType;
    placeholder?: string;
    options?: { label: string; value: any }[]; // cho select, radio
    rules?: {
        required?: boolean;
        email?: boolean;
        min?: number;
        max?: number;
    };
    colSpan?: number;
    labelPosition?: "top" | "left" | "right";
    iconLeft?: IconName
}
export interface IButtonSchema {
    type: "button";
    label: string;
    buttonType?: IButtonType;
    variant?: "secondary" | "primary" | "destructive" | "mono" | "outline" | "dashed" | "ghost" | "dim" | "foreground" | "inverse";
    className?: string
    onClick?: string;
}

interface ILine {
    type: 'line',
    styleLine?: 'x' | 'y';
    className?: string
}

interface IEmptyFieldProps {
    type: 'empty';
    width?: string;
    height?: string;
    className?: string;
}

export type IFieldAll = { span?: number } & (IFieldSchema
    | IButtonSchema
    | IGroupSchema
    | IEmptyFieldProps
    | ILine)

export interface IGroupSchema {
    type: "group";
    label?: string;
    layout: "grid" | "flex";
    columns?: number;
    direction?: "row";
    gap?: number;
    children: (IFieldAll)[];
}

export type IFormSchema = IGroupSchema;
