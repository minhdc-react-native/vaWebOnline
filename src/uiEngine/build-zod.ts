import { z, ZodTypeAny } from "zod";
import { IFormSchema, IFieldAll } from "./interface";

export function buildZodFromSchema(schema: IFormSchema): any {
    function traverse(node: IFieldAll): any {
        switch (node.type) {
            case "field":
                const fieldType = node.fieldType || "input";
                switch (fieldType) {
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
                    case "radio": {
                        let field: ZodTypeAny = z.any();
                        if (node.rules?.required) field = field.refine((v) => v !== undefined && v !== "", `${node.label} is required`);
                        return { [node.name]: field };
                    }
                    default:
                        return { [node.name]: z.any() };
                }
            case "select":
                let field: any = z.union([z.string().nullable(), z.number().nullable()]); // cho phép dữ liệu là: string | number
                if (node.rules?.required) {
                    field = field.refine((val: any) => val !== "" && val !== null, {
                        message: `${node.label} is required`
                    });
                }
                return { [node.name]: field };
            default:
                break;
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
        switch (node.type) {
            case "field":
                const fieldType = node.fieldType || "input";
                switch (fieldType) {
                    case "input":
                    case "textarea":
                    case "password":
                    case "date":
                        return { [node.name]: "" };
                    case "checkbox":
                        return { [node.name]: false };
                    case "radio":
                        return { [node.name]: "" };
                    default:
                        return { [node.name]: null };
                }
            case "select":
                return { [node.name]: null };
            default:
                break;
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