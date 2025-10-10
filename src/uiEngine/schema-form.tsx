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
import { useCallback, useEffect, useMemo } from "react";
import { TextField } from "./components/text-field";
import { cn } from "@/lib/utils";
import { AlertField } from "./components/alert-field";
import { useNodeConditions } from "./hooks/useNodeConditions";
import { SelectField } from "./components/combobox/select-field";
import { useDataSource } from "./hooks/useDataSource";
import { useT } from "@/i18n/config";
import { DateInputField } from "./components/date-input-field";

interface IRenderField {
    field: IFieldAll;
    control: any
    valuesCheck: Record<string, any>;
    dataSource?: Record<string, any[]>
    className?: string;
}

function RenderField({ field, control, valuesCheck, dataSource = {}, className }: IRenderField) {
    const { visible, disabled } = useNodeConditions(field, control, valuesCheck);
    const _ = useT();
    const label = useMemo(() => {
        return _((field as any).label || (field as any).name)
    }, [_, field]);

    if (!visible) return null;
    switch (field.type) {
        case "field":
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
                            label={label}
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
                            label={label}
                            className={className}
                            placeholder={field.placeholder}
                            labelPosition={field.labelPosition}
                            labelWidth={field.labelWidth}
                        />
                    );
                case "checkbox":
                    return <CheckboxField
                        control={control}
                        name={field.name}
                        disabled={disabled}
                        label={label}
                        className={className}
                        labelPosition={field.labelPosition}
                    />;
                case "radio":
                    return <RadioField
                        control={control}
                        name={field.name}
                        disabled={disabled}
                        label={label}
                        className={className}
                        options={field.options ?? []}
                        labelPosition={field.labelPosition}
                    />;
                case "date":
                    return (
                        <DateInputField
                            control={control}
                            name={field.name}
                            disabled={disabled}
                            label={label}
                            className={className}
                            placeholder={field.placeholder}
                            labelPosition={field.labelPosition}
                            labelWidth={field.labelWidth}
                        />
                    );
                default:
                    return null;
            }
        case "select":
            return <SelectField
                iconLeft={field.iconLeft}
                control={control}
                name={field.name}
                disabled={disabled}
                label={label}
                className={className}
                placeholder={field.placeholder}
                labelPosition={field.labelPosition}
                labelWidth={field.labelWidth}
                cleanable={field.cleanable}
                source={dataSource[field.keySource || field.name] || field.source}
                columns={field.columns}
                display={field.display}
            />
        default:
            return null;
    }
}

function OtherField({ field, control, valuesCheck, className, handleAction }: IRenderField & { handleAction: (action: string) => void; }) {
    const { getValues } = useFormContext();

    const { visible, disabled } = useNodeConditions(field, control, valuesCheck);
    if (!visible) return null;
    switch (field.type) {
        case "button":
            return <ButtonField btn={field} disabled={disabled} handleAction={handleAction} className={cn(field.className, className)} />;
        case "text":
            return <TextField className={cn(field.className, className)} variant={field.variant}
                size={field.size} weight={field.weight} muted={field.muted}>
                {field.content}
            </TextField>;
        case "alert":
            const titleContent = field.bind ? (getValues(field.bind) || valuesCheck[field.bind]) : '';
            return <AlertField className={cn(field.className, className)} variant={field.variant} icon={field.icon}
                size={field.size} titleContent={titleContent || field.titleContent} titleClassName={field.titleClassName}
                close={field.close} onClose={() => field.handleClose && handleAction(field.handleClose)} />;
        case "empty":
            return <EmptyField width={field.width} height={field.height} className={cn(field.className, className)} />;
        case "line":
            return <span className={field.className || (field.styleLine === "y" ? "h-full border-l mx-2" : "w-full border-t mx-2")} />;
        default:
            return null;
    }
}

function RenderGroup({
    schema,
    control,
    handleAction,
    valuesCheck,
    dataSource
}: {
    schema: IFieldBase & IGroupSchema;
    control: any;
    handleAction: (action: string) => void;
    valuesCheck: Record<string, any>;
    dataSource: Record<string, any[]>
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
                    case "select":
                        return (
                            <RenderField key={`${child.type}-${i}`} field={child} control={control} className={_className} valuesCheck={valuesCheck} dataSource={dataSource} />
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
                        dataSource={dataSource}
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
    const _ = useT();
    const zodSchema = buildZodFromSchema(schema, _);
    const defaultValues = buildDefaultValuesFromSchema(schema);
    const form = useForm({
        // mode: "onBlur",
        // reValidateMode: "onBlur",
        resolver: zodResolver(zodSchema),
        defaultValues: { ...defaultValues, ...values },
    });

    const onSubmit = () => {
        handleAction('submit');
    }

    const handleAction = (action: string) => {
        if (onAction) return onAction(action, form.getValues());
    };

    const { dataSource } = useDataSource({ source: schema.dataSource, control: form.control });

    useEffect(() => {
        Object.entries(values).forEach(([key, value]) => {
            form.setValue(key as any, value);
        });
    }, [values]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {headerForm}
                <RenderGroup schema={schema} control={form.control} handleAction={handleAction} valuesCheck={valuesCheck} dataSource={dataSource} />
                {footerForm}
            </form>
        </Form>
    );
}