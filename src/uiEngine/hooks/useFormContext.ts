import { createContext, useContext } from "react";

export interface IFormContext {
    dataSource: Record<string, any[]>;
}
export const FormContext = createContext<IFormContext>({
    dataSource: {}
});

export function useFormContext() {
    return useContext(FormContext);
}