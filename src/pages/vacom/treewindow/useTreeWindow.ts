import { useAuth } from "@/auth/context/auth-context";
import { getCacheItem } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IContentView, IWindowConfig } from "../type";
import { useMapConfig } from "../useMapConfig";
import { useApiMutation, useApiQuery } from "@/api/useApi";
import { IconName } from "lucide-react/dynamic";
import { useGlobalDialog } from "@/providers/global-dialog";
import { useT } from "@/i18n/config";
import { sortTreeNested } from "@/lib/helpers";
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
    const { columns, schemaWin } = useMapConfig({ windowConfig });

    const { showDialog, closeDialog, showToast } = useGlobalDialog();

    const { data, isLoading, error, isFetching, refetch: onRefresh } = useApiQuery<IData[]>([windowConfig?.WINDOW_ID],
        {
            link: `/api/System/GetDataByWindowNo`,
            method: "post",
            data: {
                ...baseParams,
                window_id: windowConfig?.WINDOW_ID
            },
            select: (response: IData[]) => {
                const dataAfterSort = sortTreeNested(response);
                if (dataAfterSort && dataAfterSort.length > 0) setItemSelected(dataAfterSort[0]);
                return dataAfterSort
            },
            enabled: !!windowConfig?.WINDOW_ID,
        },
        {
            refetchOnWindowFocus: false
        }
    )

    const createPost = useApiMutation<{ success: boolean }, Record<string, any>>(
        {
            link: "/api/System/Save",
            method: "post",
        },
        {
            onSuccess: (data: any, variables) => {
                if (data.error) {
                    showToast(data.error, "error");
                    return;
                }
                showToast(_('END_WORK'));
                if (!!variables.closeDialog) closeDialog(true);
                onRefresh();
            },
            onError: (error, variables) => {
                console.error("Lỗi:", error);
            },
        }
    );

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

    const onKeyDown = (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
        const currentIdx = data?.findIndex((item) => item.id === itemSelected?.id) ?? 0;

        if (e.key === 'ArrowDown' && data && currentIdx < (data.length - 1)) {
            e.preventDefault();
            setItemSelected(data[currentIdx + 1])
        }

        if (e.key === 'ArrowUp' && data && currentIdx > 0) {
            e.preventDefault();
            setItemSelected(data[currentIdx - 1])
        }

        if (e.key === 'Enter' && itemSelected) {
            e.preventDefault();
            onDoubleClick(itemSelected);
        }
    }
    const onDoubleClick = (row: IData) => {
        handleAction('View', row);
    }
    const editmode = useRef(0);
    const handleActionForm = useCallback((action: string, values?: Record<string, any>) => {
        switch (action) {
            case 'onCancel':
                closeDialog();
                break;
            case 'submit':
                createPost.mutate({
                    editmode: editmode.current,
                    windowid: windowConfig?.WINDOW_ID,
                    data: [values],
                    closeDialog: true
                });
                break;
            default:
                break;
        }
    }, [closeDialog, createPost, windowConfig?.WINDOW_ID]);

    const handleActionDelete = useCallback((action: string, values?: Record<string, any>) => {
        switch (action) {
            case 'onCancel':
                closeDialog();
                break;
            case 'submit':
                closeDialog(true);
                createPost.mutate({
                    editmode: 3,
                    windowid: windowConfig?.WINDOW_ID,
                    data: [{ id: values?.id }]
                });
                break;
            default:
                break;
        }
    }, [closeDialog, createPost, windowConfig?.WINDOW_ID]);

    const handleAction = useCallback((action: string, row?: IData) => {
        switch (action) {
            case 'View':
            case 'Edit':
                const itemEdit = row || itemSelected;
                if (!itemEdit) {
                    showToast(_('NO_DATA_EDIT'), "warning");
                    return;
                }
                editmode.current = 2;
                showDialog({
                    title: _('SUA'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: itemEdit,
                        valueCheck: { mode: 2 }
                    }),
                    fullWidth: !schemaWin.width,
                    width: schemaWin.width ?? undefined,
                    confirmBeforeClose: true
                })
                break;
            case 'Refresh':
                onRefresh();
                break;
            case 'New':
                editmode.current = 1;
                console.log('schemaWin>>', schemaWin);
                showDialog({
                    title: _('THEM'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: schemaWin.defaultValues ?? {},
                        valueCheck: { mode: 1 }
                    }),
                    fullWidth: !schemaWin.width,
                    width: schemaWin.width ?? undefined,
                    confirmBeforeClose: true
                })
                break;
            case 'Delete':
                const itemDelete = row || itemSelected;
                if (!itemDelete) {
                    showToast(_('NO_DATA_EDIT'), "warning");
                    return;
                }
                showDialog({
                    title: _('XOA'),
                    content: getContentView({
                        schema: schemaWin.schemaDelete,
                        handleAction: handleActionDelete,
                        values: itemDelete
                    })
                })
                break;
            case 'Copy':
                const itemCopy = row || itemSelected;
                if (!itemCopy) {
                    showToast(_('NO_CHOISE_COPY'), "warning");
                    return;
                }
                editmode.current = 1;
                showDialog({
                    title: _('COPY'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: itemCopy,
                        valueCheck: { mode: 1 }
                    }),
                    fullWidth: !schemaWin.width,
                    width: schemaWin.width ?? undefined,
                    confirmBeforeClose: true
                })
                break;
            case 'menu1':
            case 'menu2':
                showToast(`Select menu: ${action}`)
                break;
            default:
                break;
        }
    }, [_, getContentView, handleActionDelete, handleActionForm, itemSelected, onRefresh, schemaWin.defaultValues, schemaWin.schema, schemaWin.schemaDelete, schemaWin.width, showDialog, showToast])

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
        onKeyDown,
        onDoubleClick,
        onContextMenu,
        setItemSelected,
        onRefresh,
        handleAction,
        columnPinning: schemaWin.columnPinning || { left: [], right: [] }
    }
}