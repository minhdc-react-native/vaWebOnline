import { createContext, useContext } from "react";

export interface IWinContext {
    handleAction: (action: string) => void
}
export const WinContext = createContext<IWinContext>({
    handleAction: () => { }
});

export function useWinContext() {
    return useContext(WinContext);
}