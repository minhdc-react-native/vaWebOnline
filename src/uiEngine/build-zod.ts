import { z, ZodTypeAny } from "zod";
import { IFormSchema, IFieldAll } from "./interface";

export function buildZodFromSchema(schema: IFormSchema): any {
    function traverse(node: IFieldAll): any {
        if (node.type === "field") {
            switch (node.fieldType) {
                case "input":
                case "textarea":
                case "date": {
                    let field = z.string();
                    if (node.rules?.required)
                        field = field.min(1, `${node.label} is required`);
                    if (node.rules?.email) field = field.email();
                    if (node.rules?.min) field = field.min(node.rules.min);
                    if (node.rules?.max) field = field.max(node.rules.max);
                    return { [node.name]: field };
                }
                case "password": {
                    let field = z.string();
                    if (node.rules?.required) {
                        field = field.min(1, `${node.label} is required`);
                    }
                    if (node.rules?.min) {
                        field = field.min(node.rules.min, `${node.label} must be at least ${node.rules.min} characters`);
                    }
                    return { [node.name]: field };
                }
                case "checkbox": {
                    let field: ZodTypeAny = z.boolean();
                    if (node.rules?.required) field = field.refine((v) => v, `${node.label} is required`);
                    return { [node.name]: field };
                }
                case "select":
                case "radio": {
                    let field: ZodTypeAny = z.any();
                    if (node.rules?.required) field = field.refine((v) => v !== undefined && v !== "", `${node.label} is required`);
                    return { [node.name]: field };
                }
                default:
                    return { [node.name]: z.any() };
            }
        }

        // group
        if ("children" in node) {
            return node.children.reduce(
                (acc, child) => ({ ...acc, ...traverse(child) }),
                {}
            );
        }
        return {};
    }

    return z.object(traverse(schema));
}


export function buildDefaultValuesFromSchema(schema: IFormSchema): Record<string, any> {
    function traverse(node: IFieldAll): Record<string, any> {
        if (node.type === "field") {
            switch (node.fieldType) {
                case "input":
                case "textarea":
                case "password":
                case "date":
                    return { [node.name]: "" };
                case "checkbox":
                    return { [node.name]: false };
                case "select":
                case "radio":
                    return { [node.name]: "" };
                default:
                    return { [node.name]: null };
            }
        }

        // group
        if ("children" in node) {
            return node.children.reduce(
                (acc, child) => ({ ...acc, ...traverse(child) }),
                {}
            );
        }

        return {};
    }

    return traverse(schema);
}