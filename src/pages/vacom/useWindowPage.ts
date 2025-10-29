import { useAuth } from "@/auth/context/auth-context";
import { getCacheItem } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IContentView, IWindowConfig } from "./type";
import { useMapConfig } from "./useMapConfig";
import { useApiMutation, useApiQuery } from "@/api/useApi";
import { IconName } from "lucide-react/dynamic";
import { useGlobalDialog } from "@/providers/global-dialog";
import { useT } from "@/i18n/config";
import { sortTreeNested } from "@/lib/helpers";
import { api } from "@/api/apiMethods";
interface IResponce {
    data: IData[],
    pos: number,
    total_count: number;
}
const infoPageBase = { pageIndex: 0, pageSize: 50, recordCount: 500, isLoading: false };
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
    getContentView: (config: IContentView) => React.ReactNode,
    type: "tree" | 'window'
}
export const useWindowPage = ({ window_id, getContentView, type }: IProgs) => {

    const { setLoading } = useAuth();
    const [windowConfig, setWindowConfig] = useState<IWindowConfig>();
    const _ = useT();
    const { columns, schemaWin, isExpand } = useMapConfig({ windowConfig });

    const { showDialog, closeDialog, showToast } = useGlobalDialog();

    const [infoPage, setInfoPage] = useState({ ...infoPageBase });

    useEffect(() => {
        setInfoPage({ ...infoPageBase });
    }, [window_id]);

    const { data, isLoading, error, isFetching, refetch: onRefresh } = useApiQuery<IData[]>(
        ['GetDataByWindowNo', window_id],
        {
            link: `/api/System/GetDataByWindowNo`,
            method: "post",
            data: {
                ...baseParams,
                count: type === "tree" ? 999999999 : infoPage.pageSize,
                start: type === "tree" ? 0 : infoPage.pageSize * infoPage.pageIndex,
                window_id: window_id
            },
            select: (response: IResponce) => {
                if (type === "tree") {
                    const dataAfterSort = sortTreeNested(response.data);
                    if (dataAfterSort && dataAfterSort.length > 0) setItemSelected(dataAfterSort[0]);
                    return dataAfterSort;
                } else {
                    if (infoPage.pageIndex === 0) setInfoPage(prev => ({ ...prev, recordCount: response.total_count }));
                    const dataMap = response.data;
                    if (dataMap && dataMap.length > 0) setItemSelected(dataMap[0]);
                    return dataMap;
                }
            },
            enabled: !!window_id,
            isDataPage: true
        },
        {
            refetchOnWindowFocus: false
        }
    )
    useEffect(() => {
        onRefresh();
    }, [infoPage.pageIndex, infoPage.pageSize]);

    const [loadingPost, setLoadingPost] = useState<boolean>(false);

    const { mutate: createPost, isPending, isSuccess } = useApiMutation<
        { success: boolean },
        Record<string, any>
    >(
        {
            link: "/api/System/Save",
            method: "post",
        },
        {
            onMutate: (variables) => {
                if (variables.setIsProcessing) variables.setIsProcessing(true);
            },
            onSuccess: (data: any, variables) => {
                if (variables.setIsProcessing) variables.setIsProcessing(false);
                if (data.error) {
                    showToast(data.error, "error");
                    return;
                }
                showToast(_('END_WORK'));
                if (!!variables.closeDialog) closeDialog(true);
                onRefresh();
            },
            onError: (error, variables) => {
                if (variables.setIsProcessing) variables.setIsProcessing(false);
                // setLoadingPost(false);
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
    const handleActionForm = useCallback((action: string, values?: Record<string, any>, setIsProcessing?: (isProcessing: boolean) => void) => {
        switch (action) {
            case 'onCancel':
                closeDialog();
                break;
            case 'onSubmit':
                createPost({
                    editmode: editmode.current,
                    windowid: windowConfig?.WINDOW_ID,
                    data: [values],
                    closeDialog: true,
                    setIsProcessing: setIsProcessing
                });
                break;
            default:
                break;
        }
    }, [closeDialog, createPost, windowConfig?.WINDOW_ID]);

    const handleActionDelete = useCallback((action: string, values?: Record<string, any>, setIsProcessing?: (isProcessing: boolean) => void) => {
        switch (action) {
            case 'onCancel':
                closeDialog();
                break;
            case 'onSubmit':
                createPost({
                    editmode: 3,
                    windowid: windowConfig?.WINDOW_ID,
                    data: [{ id: values?.id }],
                    closeDialog: true,
                    setIsProcessing: setIsProcessing
                });
                break;
            default:
                break;
        }
    }, [closeDialog, createPost, windowConfig?.WINDOW_ID]);
    const getDataDetail = useCallback(async (itemSelected: IData, isNew?: boolean) => {
        if (schemaWin.subTabs.length > 1) {
            itemSelected.details = [];
            const tabDetails = [...schemaWin.subTabs].slice(1);
            setLoading(true);
            const promises = tabDetails.map(async (tab, idx) => {
                itemSelected.details.push({
                    TAB_ID: tab.TAB_ID,
                    TAB_TABLE: tab.TAB_TABLE,
                    data: []
                });
                if (!isNew) {
                    await api.get({
                        link: `/api/System/GetDataDetailsByTabTable?window_id=${window_id}&id=${itemSelected.id}&tab_table=${tab.TAB_TABLE}`,
                        callBack: (res: IData[]) => {
                            itemSelected.details[idx].data = res;
                        },
                        setLoading
                    })
                }
            });

            await Promise.all(promises);
            setLoading(false);
        }
    }, [schemaWin.subTabs, window_id]);

    const handleAction = useCallback(async (action: string, row?: IData) => {
        switch (action) {
            case 'View':
            case 'Edit':
                const itemEdit = row || itemSelected;
                if (!itemEdit) {
                    showToast(_('NO_DATA_EDIT'), "warning");
                    return;
                }
                editmode.current = 2;
                await getDataDetail(itemEdit);
                showDialog({
                    title: _('SUA'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: itemEdit,
                        valueCheck: { mode: 2, window_id }
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
                const itemNew: IData = { ...(schemaWin.defaultValues ?? {}), id: crypto.randomUUID() };
                editmode.current = 1;
                await getDataDetail(itemNew, true);
                showDialog({
                    title: _('THEM'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: itemNew,
                        valueCheck: { mode: 1, window_id }
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
                await getDataDetail(itemCopy);
                editmode.current = 1;
                showDialog({
                    title: _('COPY'),
                    content: getContentView({
                        schema: schemaWin.schema,
                        handleAction: handleActionForm,
                        values: itemCopy,
                        valueCheck: { mode: 1, window_id }
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
    }, [itemSelected, showDialog, _, getContentView, schemaWin, handleActionForm, onRefresh, handleActionDelete, showToast, getDataDetail])

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
        infoPage,
        setInfoPage,
        onKeyDown,
        onDoubleClick,
        onContextMenu,
        setItemSelected,
        onRefresh,
        handleAction,
        columnPinning: schemaWin.columnPinning || { left: [], right: [] },
        columnVisibility: schemaWin.columnVisibility || {},
        columnVisibilityEdit: schemaWin.columnVisibilityEdit || {},
        isExpand,
        subTabs: schemaWin.subTabs,
        schema: schemaWin.schema
    }
}