import { useCallback, useEffect, useState } from "react";
import { IDataSource } from "../interface";
import { api } from "@/api/apiMethods";

interface IProgs {
    source?: IDataSource;
}

export const useMapSource = ({ source }: IProgs) => {

    const [mapValueSource, setMapValueSource] = useState<Record<string, Map<string, string>>>({}); // lấy giá trị.

    const mapSource = useCallback((res: IData[], key: string) => {
        const map = new Map<string, string>();
        res.forEach((g: any) => map.set(g['id'], g.value));
        setMapValueSource(prev => ({ ...prev, [key]: map }));
    }, []);

    const loadDataBegin: {
        (): Promise<void>;
        controller?: AbortController;
    } = useCallback(async () => {
        if (!source) return;
        if (loadDataBegin.controller) {
            loadDataBegin.controller.abort();
        }
        const controller = new AbortController();
        loadDataBegin.controller = controller;

        const promises = Object.keys(source).map(async (key: any) => {
            const configSource: any = source[key];
            if (Array.isArray(configSource)) {
                mapSource(configSource, key);
            } else if (configSource?.url && ['combo', 'richselect'].includes(configSource?.typeEditor)) {
                const url = configSource.url;
                try {
                    await api.get({
                        link: url,
                        config: { signal: controller.signal },
                        callBack: (res) => {
                            if (!controller.signal.aborted) {
                                mapSource(res, key);
                            }
                        },
                        callError: () => {
                            if (!controller.signal.aborted) {
                                mapSource([], key);
                            }
                        },
                    });
                } catch (error) {
                    if (!controller.signal.aborted) {
                        mapSource([], key);
                    }
                }
            }
        });

        await Promise.all(promises);
    }, [mapSource, source]);

    useEffect(() => {
        loadDataBegin();
    }, [loadDataBegin])

    return {
        mapValueSource
    }
}