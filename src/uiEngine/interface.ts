import { IconName } from "lucide-react/dynamic";
import { IFontWeight, ITextSize, IVariant } from "./components/text-field";
import { IAlertAppearance, IAlertSize, IAlertVariant } from "./components/alert-field";
import { IConditions } from "./hooks/useNodeConditions";

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
    fieldType?: IFieldType;
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
    labelWidth?: number;
    iconLeft?: IconName;
    className?: string
}
export interface IButtonSchema {
    type: "button";
    label: string;
    labelLoading?: string;
    buttonType?: IButtonType;
    variant?: "secondary" | "primary" | "destructive" | "mono" | "outline" | "dashed" | "ghost" | "dim" | "foreground" | "inverse";
    appearance?: "ghost" | "default";
    handleClick?: string;
    handleProcessing?: string;
    className?: string
}

interface ITextSchema {
    type: 'text',
    content: React.ReactNode;
    variant?: IVariant;
    size?: ITextSize;
    weight?: IFontWeight;
    muted?: boolean;
    className?: string
}

interface IAlertSchema {
    type: 'alert',
    bind?: string,
    className?: string;
    variant?: IAlertVariant;
    titleContent?: string;
    titleClassName?: string;
    appearance?: IAlertAppearance;
    size?: IAlertSize;
    icon?: { name: IconName, size?: number, color?: string, className?: string };
    close?: boolean;
    handleClose?: string;
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
    className?: string
}
export type IFieldBase = {
    span?: number;
    deps?: string | string[];
    conditions?: IConditions
};
export type IFieldAll = IFieldBase & (IFieldSchema
    | IButtonSchema
    | ITextSchema
    | IGroupSchema
    | IEmptyFieldProps
    | ILine
    | IAlertSchema
)

export interface IGroupSchema {
    type: "group";
    label?: string;
    layout: "grid" | "flex";
    columns?: number;
    direction?: "row";
    gap?: number;
    className?: string;
    children: (IFieldAll)[];
}

export type IFormSchema = IGroupSchema;
