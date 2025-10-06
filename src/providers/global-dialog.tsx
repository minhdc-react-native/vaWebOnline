import { createContext, useContext, useState, ReactNode } from "react";
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
interface ITitle {
    title: string;
    subTitle?: string
};
interface IViewDialog {
    title: ITitle | string;
    content: ReactNode;
    fullWidth?: boolean,
    classNameContent?: string
}
type DialogContextType = {
    showDialog: (node: IViewDialog) => void;
    closeDialog: () => void;
    showToast: (title: string | React.ReactNode, type?: 'success' | 'warning' | 'error' | 'info') => void
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

    const showDialog = (node: IViewDialog) => {
        setDialogs((prev) => [...prev, node]);
    };

    const closeDialog = () => {
        setDialogs((prev) => prev.slice(0, -1)); // pop thằng cuối
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
    return (
        <DialogContext.Provider value={{ showDialog, closeDialog, showToast }}>
            {children}
            {dialogs.map((view, i) => (
                <Dialog
                    key={i}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) setDialogs((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                >
                    <DialogContent className={cn(
                        view.fullWidth ? "w-screen max-w-screen h-screen max-h-screen rounded-[0px]" : "w-auto max-w-none",
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
                        {view.content}
                    </DialogContent>
                </Dialog>
            ))}
        </DialogContext.Provider>
    );
};
