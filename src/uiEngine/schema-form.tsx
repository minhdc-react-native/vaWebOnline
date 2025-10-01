import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildZodFromSchema, buildDefaultValuesFromSchema } from "./build-zod";
import { IFormSchema, IFieldSchema, IGroupSchema } from "./interface";
import { PasswordField } from "./components/password-field";
import { CheckboxField } from "./components/checkbox-field";
import { RadioField } from "./components/radio-field";
import { TextField } from "./components/text-field";
import { EmptyField } from "./components/empty-field";
import { ButtonField } from "./components/button-field";
import { Form } from "@/components/ui/form";
import { useCallback } from "react";

function RenderField({ field, control, className }: { field: IFieldSchema; control: any, className?: string }) {

    switch (field.fieldType) {
        case "input":
        case "textarea":
            return (
                <TextField
                    key={field.name}
                    iconLeft={field.iconLeft}
                    type={field.fieldType}
                    control={control}
                    name={field.name}
                    label={field.label}
                    className={className}
                    placeholder={field.placeholder}
                    labelPosition={field.labelPosition}
                />
            );
        case "password":
            return (
                <PasswordField
                    key={field.name}
                    iconLeft={field.iconLeft}
                    control={control}
                    name={field.name}
                    label={field.label}
                    className={className}
                    placeholder={field.placeholder}
                    labelPosition={field.labelPosition}
                />
            );
        case "checkbox":
            return (
                <CheckboxField
                    key={field.name}
                    control={control}
                    name={field.name}
                    label={field.label}
                    className={className}
                    labelPosition={field.labelPosition}
                />
            );
        case "radio":
            return (
                <RadioField
                    key={field.name}
                    control={control}
                    name={field.name}
                    label={field.label}
                    className={className}
                    options={field.options ?? []}
                    labelPosition={field.labelPosition}
                />
            );
        default:
            return null;
    }
}

function RenderGroup({
    schema,
    control,
    handleAction,
}: {
    schema: IGroupSchema;
    control: any;
    handleAction: (action: string) => void;
}) {
    const direction = schema.direction || "col";
    const layoutClass =
        schema.layout === "grid"
            ? `grid grid-${direction}s-${schema.columns || 2} gap-${schema.gap || 4}`
            : `flex flex-${direction} gap-${schema.gap || 4}`;

    const spanClass = useCallback((span?: number) => {
        return span === undefined ? undefined : schema.layout === "grid"
            ? `${direction}-span-[${Math.min(span, (schema.columns || 2))}]`
            : `flex-[${Math.max(span, (schema.columns || 2))}]`;

    }, [schema, direction])

    return (
        <div className={layoutClass}>
            {schema.children.map((child, i) => {
                const _className = spanClass(child.span);
                switch (child.type) {
                    case "field":
                        return (
                            <RenderField key={`${child.type}-${i}`} field={child} control={control} className={_className} />
                        );
                    case "button":
                        return (
                            <ButtonField key={`${child.type}-${i}`} btn={child} handleAction={handleAction} className={_className} />
                        );
                    case "empty":
                        return (
                            <EmptyField key={`${child.type}-${i}`} width={child.width} height={child.height} className={`${child.className || ''} ${_className || ''}`} />
                        );
                    case "line":
                        return (
                            <span key={`${child.type}-${i}`} className={child.className || (child.styleLine === "y" ? "h-full border-l mx-2" : "w-full border-t mx-2")} />
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
                    />
                );
            })}
        </div>
    );
}

export function SchemaForm({
    schema,
    onAction
}: {
    schema: IFormSchema;
    onAction?: (action: string, values?: any) => void;
}) {
    const zodSchema = buildZodFromSchema(schema);
    const defaultValues = buildDefaultValuesFromSchema(schema);
    const form = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues,
    });
    const onSubmit = () => {
        handleAction('submit');
    }
    const handleAction = (action: string) => {
        if (onAction) onAction(action, form.getValues());
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <RenderGroup schema={schema} control={form.control} handleAction={handleAction} />
            </form>
        </Form>
    );
}