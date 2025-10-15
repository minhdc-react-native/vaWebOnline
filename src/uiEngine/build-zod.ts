import { z, ZodTypeAny } from "zod";
import { IFormSchema, IFieldAll } from "./interface";
import { useMemo } from "react";

export function buildZodFromSchema(
    schema: IFormSchema,
    _: (id: string | undefined, values?: Record<string, any>) => string | undefined
): any {
    function traverse(node: IFieldAll): any {
        const labelMessage = `${_((node as any).label)}`;
        let field: any;
        switch (node.type) {
            case "field": {
                const fieldType = node.fieldType || "input";
                switch (fieldType) {
                    case "input":
                    case "textarea": {
                        field = z
                            .union([z.string(), z.number()])
                            .transform((v) => (v === "" ? null : v))
                            .nullable();

                        if (node.rules?.required)
                            field = field.refine((v: any) => v !== null && v !== "", {
                                message: `${labelMessage} ${_('is required')}`,
                            });
                        if (node.rules?.email) field = field.refine((v: any) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)), {
                            message: `${labelMessage} ${_('must be a valid email')}`,
                        });
                        if (node.rules?.min)
                            field = field.refine(
                                (v: any) => !v || String(v).length >= node.rules!.min!,
                                { message: `${labelMessage} ${_('must be at least')} ${node.rules.min}` }
                            );
                        if (node.rules?.max)
                            field = field.refine(
                                (v: any) => !v || String(v).length <= node.rules!.max!,
                                { message: `${labelMessage} ${_('must be at most')} ${node.rules.max}` }
                            );
                        return { [node.name]: field };
                    }

                    case "date": {
                        field = z
                            .string()
                            .nullable()
                            .transform((v) => (v === "" ? null : v));
                        if (node.rules?.required)
                            field = field.refine((v: any) => !!v, {
                                message: `${labelMessage} ${_('is required')}`,
                            });
                        return { [node.name]: field };
                    }

                    case "password": {
                        field = z.string().nullable();
                        if (node.rules?.required)
                            field = field.refine((v: any) => !!v && v.trim() !== "", {
                                message: `${labelMessage} ${_('is required')}`,
                            });
                        if (node.rules?.min)
                            field = field.refine(
                                (v: any) => !v || v.length >= node.rules!.min!,
                                { message: `${labelMessage} ${_('must be at least')} ${node.rules.min}` }
                            );
                        if (node.rules?.max)
                            field = field.refine(
                                (v: any) => !v || v.length <= node.rules!.max!,
                                { message: `${labelMessage} ${_('must be at most')} ${node.rules.max}` }
                            );
                        return { [node.name]: field };
                    }

                    case "checkbox": {
                        field = z
                            .union([
                                z.boolean(),
                                z.string(),
                                z.number(),
                                z.null().optional(),
                            ])
                            .transform((val) => {
                                if (val === null || val === undefined || val === '') return false;
                                // Default
                                if (typeof val === 'boolean') return val;

                                // String -> boolean
                                if (typeof val === 'string') {
                                    const v = val.toLowerCase().trim();
                                    if (v === 'c' || v === 'true' || v === '1') return true;
                                    if (v === 'k' || v === 'false' || v === '0' || v === '') return false;
                                }

                                // Number -> boolean
                                if (typeof val === 'number') {
                                    return val === 1;
                                }

                                return false;
                            });

                        if (node.rules?.required) {
                            field = field.refine((v: any) => v === true, {
                                message: `${labelMessage} ${_('is required')}`,
                            });
                        }

                        return { [node.name]: field };
                    }

                    case "radio": {
                        let field: ZodTypeAny = z.union([z.string(), z.number()]).nullable();
                        if (node.rules?.required)
                            field = field.refine((v) => v !== null && v !== "", {
                                message: `${labelMessage} ${_('is required')}`,
                            });
                        return { [node.name]: field };
                    }

                    default:
                        return { [node.name]: z.any() };
                }
            }
            case "color": {
                field = z
                    .string()
                    .nullable()
                    .transform((v) => (v === "" ? null : v));
                if (node.rules?.required)
                    field = field.refine((v: any) => !!v, {
                        message: `${labelMessage} ${_('is required')}`,
                    });
                return { [node.name]: field };
            }

            case "select":
            case "multiselect": {
                field = z.union([z.string(), z.number()]).nullable();
                if (node.rules?.required)
                    field = field.refine((v: any) => v !== null && v !== "", {
                        message: `${labelMessage} ${_('is required')}`,
                    });
                return { [node.name]: field };
            }

            case "number":
            case "rating": {
                field = z
                    .union([z.string(), z.number()])
                    .nullable()
                    .transform((v) =>
                        typeof v === "string" && v.trim() === "" ? null : v
                    )
                    .refine((v) => v === null || !isNaN(Number(v)), {
                        message: `${labelMessage} ${_('must be a number')}`,
                    });

                if (node.rules?.required)
                    field = field.refine((v: any) => v !== null && v !== "", {
                        message: `${labelMessage} ${_('is required')}`,
                    });
                return { [node.name]: field };
            }

            default:
                break;
        }
        if ("children" in node) {
            if (Array.isArray(node.children)) {
                return node.children.reduce(
                    (acc, child) => ({ ...acc, ...traverse(child) }),
                    {}
                );
            } else if (Array.isArray(node.children?.children)) {
                return node.children.children.reduce(
                    (acc, child) => ({ ...acc, ...traverse(child) }),
                    {}
                );
            }
        }

        return {};
    }

    return z.object(traverse(schema));
}



export function buildDefaultValuesFromSchema(schema: IFormSchema): Record<string, any> {
    function traverse(node: IFieldAll): Record<string, any> {
        switch (node.type) {
            case "field":
                const fieldType = node.fieldType || "input";
                switch (fieldType) {
                    case "input":
                    case "textarea":
                    case "password":
                        return { [node.name]: "" };
                    case "checkbox":
                        return { [node.name]: (node.checkType === "number" ? 0 : (node.checkType === "string" ? 'K' : false)) };
                    case "radio":
                        return { [node.name]: "" };
                    default:
                        return { [node.name]: null };
                }
            case "color":
                return { [node.name]: "" };
            case "select":
            case "multiselect":
                return { [node.name]: null };
            case "number":
            case "rating":
                return { [node.name]: null };
            default:
                break;
        }
        // group
        if ("children" in node) {
            if (Array.isArray(node.children)) {
                return node.children.reduce(
                    (acc, child) => ({ ...acc, ...traverse(child) }),
                    {}
                );
            } else if (Array.isArray(node.children.children)) {
                return node.children.children.reduce(
                    (acc, child) => ({ ...acc, ...traverse(child) }),
                    {}
                );
            }
        }

        return {};
    }

    return traverse(schema);
}