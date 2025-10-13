import { useAuth } from "@/auth/context/auth-context";
import { getCacheItem } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IContentView, IWindowConfig } from "../type";
import { useMapConfig } from "../useMapConfig";
import { useApiQuery } from "@/api/useApi";
import { IconName } from "lucide-react/dynamic";
import { useGlobalDialog } from "@/providers/global-dialog";
import { useT } from "@/i18n/config";
const baseParams = {
    start: 0,
    count: 999999999,
    continue: null,
    filter: [],
    tlbparam: [],
    infoparam: null
}
interface IContextMenu {
    onContext: (menuKey: string, row: IData) => void
    permission: { new: boolean, edit: boolean, delete: boolean };
    addMenu: {
        id: string;
        title: string;
        icon?: IconName
    }[]
}
interface IProgs {
    window_id?: string;
    getContentView: (config: IContentView) => React.ReactNode
}
export const useTreeWindow = ({ window_id, getContentView }: IProgs) => {

    const { setLoading } = useAuth();
    const [windowConfig, setWindowConfig] = useState<IWindowConfig>();
    const _ = useT();
    const { sortTreeNested, columns, schemaWin } = useMapConfig({ windowConfig });

    const { showDialog, closeDialog } = useGlobalDialog();

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
        handleAction('View', row);
    }
    const onActionForm = (action: string, values?: Record<string, any> | undefined) => {

    }
    const handleActionForm = useCallback((action: string, values?: Record<string, any>) => {
        switch (action) {
            case 'onCancel':
                closeDialog();
                break;

            default:
                break;
        }
    }, [closeDialog]);

    const handleAction = useCallback((action: string, row?: IData) => {
        switch (action) {
            case 'View':
            case 'Edit':
                showDialog({
                    title: _('EDIT'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: row || itemSelected || {},
                        valueCheck: { mode: -1 }
                    }),
                    fullWidth: !schemaWin.width,
                    classNameContent: !schemaWin.width ? undefined : `w-[${schemaWin.width}px]`,
                    confirmBeforeClose: true
                })
                break;
            case 'Refresh':
                onRefresh();
                break;
            case 'New':
                showDialog({
                    title: _('NEW'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: {},
                        valueCheck: { mode: 1 }
                    }),
                    fullWidth: !schemaWin.width,
                    classNameContent: !schemaWin.width ? undefined : `w-[${schemaWin.width}px]`,
                    confirmBeforeClose: true
                })
                break;

            case 'Delete':
                break;
            case 'Copy':
                showDialog({
                    title: _('COPY'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: row || itemSelected || {},
                        valueCheck: { mode: 1 }
                    }),
                    fullWidth: !schemaWin.width,
                    classNameContent: !schemaWin.width ? undefined : `w-[${schemaWin.width}px]`,
                    confirmBeforeClose: true
                })
                break;
            case 'menu1':
                break;
            case 'menu2':
                break;
            default:
                break;
        }
    }, [_, getContentView, handleActionForm, itemSelected, onRefresh, schemaWin.schema, schemaWin.width, showDialog])

    const onContextMenu: IContextMenu = {
        onContext: handleAction,
        permission,
        addMenu: [
            { id: 'menu1', title: "Add menu 1", icon: "database" },
            { id: 'menu2', title: "Add menu 2", icon: "key" }
        ]
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
        onRefresh,
        handleAction
    }
}