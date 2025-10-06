import React from "react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { useT } from "@/i18n/config";

export type IAlertVariant = "info" | "secondary" | "primary" | "destructive" | "success" | "mono" | "warning";
export type IAlertAppearance = "stroke" | "solid" | "outline" | "light";
export type IAlertSize = "sm" | "md" | "lg";

interface IAlertFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: IAlertVariant;
    titleContent: string;
    titleClassName?: string;
    appearance?: IAlertAppearance;
    size?: IAlertSize;
    icon?: { name: IconName, size?: number, color?: string, className?: string };
    close?: boolean;
    onClose?: () => void;
}

export const AlertField: React.FC<IAlertFieldProps> = ({
    variant,
    titleContent,
    titleClassName = 'text-accent-foreground',
    appearance = "light",
    size,
    icon = { name: "alert-circle" },
    close, onClose,
    ...rest
}) => {
    const _ = useT();
    return (
        <Alert variant={variant} appearance={appearance} size={size} close={close} onClose={onClose} {...rest} >
            <AlertIcon>
                <DynamicIcon name={icon.name} size={icon.size} color={icon.color} className={icon.className} />
            </AlertIcon>
            <AlertTitle className={titleClassName}>
                <span dangerouslySetInnerHTML={{ __html: _(titleContent) ?? "" }} />
            </AlertTitle>
        </Alert>
    );
};
