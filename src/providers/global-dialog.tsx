import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { RiCheckboxCircleFill, RiCloseCircleFill, RiErrorWarningFill, RiInformationFill } from "@remixicon/react";
import { useT } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { ButtonField } from "@/uiEngine/components/button-field";
interface ITitle {
    title: string;
    subTitle?: string
};
interface IViewDialog {
    title: ITitle | string;
    content: ReactNode;
    fullWidth?: boolean,
    width?: number,
    classNameContent?: string,
    confirmBeforeClose?: boolean;
}
type DialogContextType = {
    showDialog: (node: IViewDialog) => void;
    closeDialog: (isSubmit?: boolean) => void;
    showToast: (title: string | React.ReactNode, type?: 'success' | 'warning' | 'error' | 'info') => void;
    isDialogOpen: boolean;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useGlobalDialog = () => {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error("useGlobalDialog must be used inside provider");
    return ctx;
};

type ToastType = 'success' | 'warning' | 'error' | 'info';

export const GlobalDialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialogs, setDialogs] = useState<IViewDialog[]>([]);
    const _ = useT();

    const dialogsRef = useRef(dialogs);
    useEffect(() => {
        dialogsRef.current = dialogs;
    }, [dialogs]);

    const showDialog = (node: IViewDialog) => {
        setDialogs((prev) => [...prev, node]);
    };
    const closeDialog = (isSubmit?: boolean) => {
        const lastIdx = dialogsRef.current.length - 1;
        const lastView = dialogsRef.current[lastIdx];
        handleDialogClose(lastIdx, lastView, !!isSubmit);
    };

    const showToast = (
        title: string | React.ReactNode,
        type: ToastType = "info"
    ) => {

        const config = {
            success: {
                icon: <RiCheckboxCircleFill className="text-green-500" />,
                bg: 'bg-green-50 dark:bg-green-900/20',
                border: 'border-green-300 dark:border-green-800',
                text: 'text-green-800 dark:text-green-100',
            },
            warning: {
                icon: <RiErrorWarningFill className="text-yellow-500" />,
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                border: 'border-yellow-300 dark:border-yellow-800',
                text: 'text-yellow-800 dark:text-yellow-100',
            },
            error: {
                icon: <RiCloseCircleFill className="text-red-500" />,
                bg: 'bg-red-50 dark:bg-red-900/20',
                border: 'border-red-300 dark:border-red-800',
                text: 'text-red-800 dark:text-red-100',
            },
            info: {
                icon: <RiInformationFill className="text-blue-500" />,
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-300 dark:border-blue-800',
                text: 'text-blue-800 dark:text-blue-100',
            },
        }[type ?? "info"];

        toast.custom(
            () => (
                <Alert
                    className={`flex items-center gap-2 rounded-xl border p-3 shadow-md ${config.bg} ${config.border} ${config.text}`}
                >
                    <AlertIcon className="shrink-0">{config.icon}</AlertIcon>
                    <AlertTitle className="font-medium">{title}</AlertTitle>
                </Alert>
            ),
            {
                position: 'top-center',
                duration: 3000,
            }
        );
    };


    const handleDialogClose = (i: number, view: IViewDialog, isSubmit?: boolean) => {
        if (!view.confirmBeforeClose || isSubmit) {
            setDialogs((prev) => prev.filter((_, idx) => idx !== i));
            return;
        }
        const handleAction = (action: string) => {
            switch (action) {
                case 'onExit':
                    setDialogs((prev2) =>
                        prev2.filter((_, idx) => idx !== prev2.length - 1 && idx !== i)
                    );
                    break;
                default:
                    setDialogs((prev2) => prev2.filter((_, idx) => idx !== prev2.length - 1))
                    break;
            }
        }
        setDialogs((prev) => [
            ...prev,
            {
                title: _('THOAT'),
                content: (
                    <div className="flex flex-col gap-4">
                        <p>{_('MUON_THOAT')}</p>
                        <div className="flex justify-end gap-2">
                            <ButtonField
                                btn={
                                    {
                                        type: "button",
                                        label: _('KHONG'),
                                        variant: "outline",
                                        handleClick: "onCancel",
                                        className: "min-w-[100px]"
                                    }
                                }
                                handleAction={handleAction}
                            />
                            <ButtonField
                                btn={
                                    {
                                        type: "button",
                                        label: _('CO'),
                                        variant: "primary",
                                        handleClick: "onExit",
                                        className: "min-w-[100px]",
                                        autoFocus: true
                                    }
                                }
                                handleAction={handleAction}
                            />
                        </div>
                    </div>
                ),
            },
        ]);
    };
    return (
        <DialogContext.Provider value={{ showDialog, closeDialog, showToast, isDialogOpen: dialogs.length > 0 }}>
            {children}
            {dialogs.map((view, i) => (
                <Dialog
                    key={i}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) handleDialogClose(i, view);
                    }}
                >
                    <DialogContent
                        // style={{ width: view.width }}
                        className={cn(
                            view.fullWidth ? "w-screen flex max-w-screen h-screen max-h-screen rounded-[0px]" : "w-auto max-w-none",
                            view.classNameContent
                        )}>
                        <DialogHeader className="pb-2 m-0">
                            <DialogTitle>
                                {typeof view.title === "string"
                                    ? view.title
                                    : view.title.title}
                            </DialogTitle>
                            {typeof view.title !== "string" && view.title.subTitle && (
                                <DialogDescription>{view.title.subTitle}</DialogDescription>
                            )}
                        </DialogHeader>
                        <span className="w-full border-t mb-2" />
                        <div style={{ width: view.width }} className={cn("flex flex-1 h-full max-w-full", view.fullWidth && 'pb-10')}>
                            {view.content}
                        </div>
                    </DialogContent>
                </Dialog>
            ))}
        </DialogContext.Provider>
    );
};
