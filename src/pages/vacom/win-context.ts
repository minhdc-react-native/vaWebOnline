import { createContext, useContext } from "react";

export interface IWinContext {
    handleAction: (action: string, row?: IData) => void,
    itemSelected: IData,
    window_id: string;
    mapValueSource: Record<string, Map<string, string>>;
}
export const WinContext = createContext<IWinContext>({
    handleAction: () => { },
    itemSelected: { id: '' },
    window_id: '',
    mapValueSource: {}
});

export function useWinContext() {
    return useContext(WinContext);
}