import { useCallback, useEffect, useMemo, useState } from "react";
import { IDataSource } from "../interface";
import { sortTreeFlat } from "@/lib/helpers";
import { api } from "@/api/apiMethods";
import { useWatch } from "react-hook-form";

interface IProgs {
    source?: IDataSource;
    control: any;
}

export const useDataSource = ({ source, control }: IProgs) => {

    const fieldsWatch = useMemo(() => {
        const mapKey: Record<string, string> =
            Object.values(source ?? {}).reduce((acc, cur) => ({ ...acc, ...(!Array.isArray(cur) ? (cur.mapKey ?? {}) : {}) }), {});
        const watch = Object.keys(mapKey).map(k => mapKey[k]);
        return { mapKey, watch }
    }, [source])

    const valuesWatch = useWatch({
        control: control,
        name: fieldsWatch.watch,
    });
    const [dataSource, setDataSource] = useState<Record<string, any[]>>({});
    const setSource = useCallback((res: IData[] | string[], source: any, key: string) => {
        if (res.length === 0) {
            setDataSource(prev => ({
                ...prev,
                [key]: []
            }));
            return;
        };
        const configSource: any = source[key];

        if (res.length > 0 && typeof res[0] === "string") res = (res as string[]).map(r => ({ id: r as string, value: r as string }));

        if (configSource.typeData === "tree") res = sortTreeFlat((res as IData[]), configSource.fieldCode);
        const fields: string[] = configSource.fields || Object.keys(res[0]);
        const isColor = fields.indexOf("color") < 0 && typeof configSource.getColor === "function";
        const result = res.map((item: any) => {
            const obj = Object.fromEntries(
                fields.map(f => [f, item[f]])
            );
            if (isColor) {
                obj.color = configSource.getColor(item);
            }
            return obj;
        });
        setDataSource(prev => ({
            ...prev,
            [key]: result
        }));
    }, []);

    const loadDataBegin = useCallback(async () => {
        if (!source) return;
        const promises = Object.keys(source).map(async (key: any) => {
            const configSource: any = source[key];
            if (Array.isArray(configSource)) {
                setDataSource(prev => ({
                    ...prev,
                    [key]: configSource
                }));
            } else if (configSource?.url) {
                let url: any = configSource.url;
                // thay thế nếu có param field gắn vào.
                Object.keys(fieldsWatch.mapKey).map((k, idx) => {
                    url = url.replace(k, valuesWatch[idx]);
                });

                try {
                    await api.get({
                        link: url,
                        callBack: (res => {
                            if (res) {
                                setSource(res, source, key);
                            }
                        })
                    });
                } catch (error) {
                    setSource([], source, key);
                }

            }
        });
        await Promise.all(promises);
    }, [fieldsWatch, setSource, source, valuesWatch]);

    useEffect(() => {
        loadDataBegin();
    }, [loadDataBegin])

    return {
        dataSource
    }
}