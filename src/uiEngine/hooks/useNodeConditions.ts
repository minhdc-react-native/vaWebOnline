import { useRef } from "react";
import { IFieldAll } from "../interface";
import { useWatch } from "react-hook-form";

type IConditionExpr =
    | string
    | boolean
    | ((values: Record<string, any>) => boolean);

export interface IConditions {
    visible?: IConditionExpr;
    disabled?: IConditionExpr;
}

function normalizeDeps(deps?: string | string[]): string[] {
    if (!deps) return [];
    return Array.isArray(deps) ? deps : [deps];
}

export function useNodeConditions(node: IFieldAll, control: any, valuesCheck: Record<string, any> = {}) {

    const deps = normalizeDeps(node?.deps);

    // luôn gọi 1 lần, deps có thể undefined
    const values = useWatch({ control, name: deps });

    // normalize context values (nếu deps nhiều thì map thành object)
    const contextValues = Object.fromEntries(deps.map((k, i) => [k, values[i]]));

    const evaluate = (expr: IConditionExpr | undefined, defaultValue: boolean): boolean => {
        if (expr === undefined) return defaultValue;
        if (typeof expr === "boolean") return expr;
        if (typeof expr === "function") return expr(contextValues || {});
        if (typeof expr === "string") {
            try {
                const keys = Object.keys(valuesCheck);
                const fn = new Function(...deps, ...keys, `return (${expr})`);
                const addValuesCheck = [...keys.map((key) => valuesCheck[key])];
                return fn(...values, ...addValuesCheck);
            } catch {
                return defaultValue;
            }
        }
        return defaultValue;
    };
    return {
        visible: evaluate(node.conditions?.visible, true),
        disabled: evaluate(node.conditions?.disabled, false),
    };
}