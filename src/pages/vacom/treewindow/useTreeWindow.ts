import { useAuth } from "@/auth/context/auth-context";
import { getCacheItem } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { IWindowConfig } from "../type";

interface IProgs {
    window_id?: string;
}
export const useTreeWindow = ({ window_id }: IProgs) => {

    const { setLoading } = useAuth();
    const [windowConfig, setWindowConfig] = useState<IWindowConfig>();
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

    return {
        windowConfig
    }
}