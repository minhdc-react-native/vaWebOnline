import { useAuth } from "@/auth/context/auth-context";
import { getCacheItem } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IWindowConfig } from "../type";
import { useMapConfig } from "../useMapConfig";
import { useApiQuery } from "@/api/useApi";
const baseParams = {
    start: 0,
    count: 999999999,
    continue: null,
    filter: [],
    tlbparam: [],
    infoparam: null
}
interface IProgs {
    window_id?: string;
}
export const useTreeWindow = ({ window_id }: IProgs) => {

    const { setLoading } = useAuth();
    const [windowConfig, setWindowConfig] = useState<IWindowConfig>();

    const { sortTreeNested, columns } = useMapConfig({ windowConfig });

    const { data, isLoading, error, isFetching, refetch: onRefresh } = useApiQuery<IData[]>([windowConfig?.WINDOW_ID],
        {
            link: `/api/System/GetDataByWindowNo`,
            method: "post",
            data: {
                ...baseParams,
                window_id: windowConfig?.WINDOW_ID
            },
            select: (response: IData[]) => sortTreeNested(response),
            enabled: !!windowConfig?.WINDOW_ID,
        },
        {
            refetchOnWindowFocus: false
        }
    )
    const [itemSelected, setItemSelected] = useState<IData>();

    useEffect(() => {
        setLoading(isFetching);
    }, [isFetching]);

    const getConfig = useCallback(async () => {
        if (!window_id) return;
        setLoading(true);
        const res: IWindowConfig[] = await getCacheItem({
            cacheKey: window_id,
            url: `/api/System/GetAllByWindowNo?window_id=${window_id}`,
            onMapRes: (res) => {
                return res;
            }
        });
        if (res && res.length > 0) setWindowConfig(res[0]);
        setLoading(false);
    }, [window_id, setLoading]);

    useEffect(() => {
        getConfig();
    }, [getConfig]);

    const permission = useMemo(() => {
        return {
            new: !!windowConfig?.Tabs[0].INSERT_STORE_PROCEDURE,
            edit: !!windowConfig?.Tabs[0].UPDATE_STORE_PROCEDURE,
            delete: !!windowConfig?.Tabs[0].DELETE_STORE_PROCEDURE
        }
    }, [windowConfig]);

    const onDoubleClick = (row: IData) => {
        console.log("onDoubleClick>>", row);
    }
    const onContextMenu = (menuKey: string, row: IData) => {

    }
    return {
        windowConfig,
        columns,
        data,
        itemSelected,
        permission,
        onDoubleClick,
        onContextMenu,
        setItemSelected,
        onRefresh
    }
}