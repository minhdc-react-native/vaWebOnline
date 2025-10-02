import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodFromSchema, buildDefaultValuesFromSchema } from "./build-zod";
import { IFormSchema, IFieldSchema, IGroupSchema, IFieldBase, IFieldAll } from "./interface";
import { PasswordField } from "./components/password-field";
import { CheckboxField } from "./components/checkbox-field";
import { RadioField } from "./components/radio-field";
import { InputField } from "./components/input-field";
import { EmptyField } from "./components/empty-field";
import { ButtonField } from "./components/button-field";
import { Form } from "@/components/ui/form";
import { useCallback, useEffect } from "react";
import { TextField } from "./components/text-field";
import { cn } from "@/lib/utils";
import { AlertField } from "./components/alert-field";
import { useNodeConditions } from "./hooks/useNodeConditions";

interface IRenderField {
    field: IFieldAll;
    control: any
    valuesCheck: Record<string, any>;
    className?: string;
}

function RenderField({ field, control, valuesCheck, className }: IRenderField) {
    const { visible, disabled } = useNodeConditions(field, control, valuesCheck);
    if (!visible) return null;
    if (field.type === "field") {
        const fieldType = field.fieldType || "input";
        switch (fieldType) {
            case "input":
            case "textarea":
                return (
                    <InputField
                        iconLeft={field.iconLeft}
                        type={fieldType}
                        control={control}
                        name={field.name}
                        disabled={disabled}
                        label={field.label}
                        className={className}
                        placeholder={field.placeholder}
                        labelPosition={field.labelPosition}
                        labelWidth={field.labelWidth}
                    />
                );
            case "password":
                return (
                    <PasswordField
                        iconLeft={field.iconLeft}
                        control={control}
                        name={field.name}
                        disabled={disabled}
                        label={field.label}
                        className={className}
                        placeholder={field.placeholder}
                        labelPosition={field.labelPosition}
                        labelWidth={field.labelWidth}
                    />
                );
            case "checkbox":
                return (
                    <CheckboxField
                        control={control}
                        name={field.name}
                        disabled={disabled}
                        label={field.label}
                        className={className}
                        labelPosition={field.labelPosition}
                    />
                );
            case "radio":
                return (
                    <RadioField
                        control={control}
                        name={field.name}
                        disabled={disabled}
                        label={field.label}
                        className={className}
                        options={field.options ?? []}
                        labelPosition={field.labelPosition}
                    />
                );
            default:
                return null;
        }
    } else {
        return null;
    }
}

function OtherField({ field, control, valuesCheck, className, handleAction }: IRenderField & { handleAction: (action: string) => void; }) {
    const { getValues } = useFormContext();

    const { visible, disabled } = useNodeConditions(field, control, valuesCheck);
    if (!visible) return null;
    switch (field.type) {
        case "button":
            return (
                <ButtonField btn={field} disabled={disabled} handleAction={handleAction} className={cn(field.className, className)} />
            );
        case "text":
            return (
                <TextField className={cn(field.className, className)} variant={field.variant}
                    size={field.size} weight={field.weight} muted={field.muted}>
                    {field.content}
                </TextField>
            );
        case "alert":
            const titleContent = field.bind ? (getValues(field.bind) || valuesCheck[field.bind]) : '';
            return (
                <AlertField className={cn(field.className, className)} variant={field.variant} icon={field.icon}
                    size={field.size} titleContent={titleContent || field.titleContent} titleClassName={field.titleClassName}
                    close={field.close} onClose={() => field.handleClose && handleAction(field.handleClose)} />
            );
        case "empty":
            return (
                <EmptyField width={field.width} height={field.height} className={cn(field.className, className)} />
            );
        case "line":
            return (
                <span className={field.className || (field.styleLine === "y" ? "h-full border-l mx-2" : "w-full border-t mx-2")} />
            );
        default:
            return null;
    }
}

function RenderGroup({
    schema,
    control,
    handleAction,
    valuesCheck
}: {
    schema: IFieldBase & IGroupSchema;
    control: any;
    handleAction: (action: string) => void;
    valuesCheck: Record<string, any>;
}) {

    const direction = schema.direction || "col";
    const layoutClass =
        schema.layout === "grid"
            ? `grid grid-${direction}s-${schema.columns || 2} gap-${schema.gap || 2}`
            : `flex flex-${direction} gap-${schema.gap || 2}`;

    const spanClass = useCallback((span?: number) => {
        return span === undefined ? undefined : schema.layout === "grid"
            ? `${direction}-span-${Math.min(span, (schema.columns || 2))}`
            : `flex-${Math.max(span, (schema.columns || 2))}`;

    }, [schema, direction])

    const { visible } = useNodeConditions(schema, control, valuesCheck);
    if (!visible) return null;

    return (
        <div className={cn(layoutClass, schema.className)}>
            {schema.children.map((child, i) => {
                const _className = spanClass(child.span);
                switch (child.type) {
                    case "field":
                        return (
                            <RenderField key={`${child.type}-${i}`} field={child} control={control} className={_className} valuesCheck={valuesCheck} />
                        );
                    case "button":
                    case "text":
                    case "alert":
                    case "empty":
                    case "line":
                        return (
                            <OtherField key={`${child.type}-${i}`} field={child} control={control} className={_className} valuesCheck={valuesCheck} handleAction={handleAction} />
                        );
                    default:
                        break;
                }

                return (
                    <RenderGroup
                        key={`${child.type}-${i}`}
                        schema={child}
                        control={control}
                        handleAction={handleAction}
                        valuesCheck={valuesCheck}
                    />
                );
            })}
        </div>
    );
}

export function SchemaForm({
    schema,
    onAction,
    values = {},
    valuesCheck = {},
    headerForm,
    footerForm
}: {
    schema: IFieldBase & IFormSchema;
    onAction?: (action: string, values?: Record<string, any>) => void;
    values?: Record<string, any>;
    valuesCheck?: Record<string, any>;
    headerForm?: React.ReactNode;
    footerForm?: React.ReactNode;
}) {

    const zodSchema = buildZodFromSchema(schema);
    const defaultValues = buildDefaultValuesFromSchema(schema);
    const form = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues: { ...defaultValues, ...values },
    });
    const onSubmit = () => {
        handleAction('submit');
    }
    const handleAction = (action: string) => {
        if (onAction) return onAction(action, form.getValues());
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {headerForm}
                <RenderGroup schema={schema} control={form.control} handleAction={handleAction} valuesCheck={valuesCheck} />
                {footerForm}
            </form>
        </Form>
    );
}