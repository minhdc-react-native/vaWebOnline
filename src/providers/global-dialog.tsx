import { createContext, useContext, useState, ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from "@/lib/utils";
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
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useGlobalDialog = () => {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error("useGlobalDialog must be used inside provider");
    return ctx;
};

export const GlobalDialogProvider = ({ children }: { children: ReactNode }) => {
    const [dialogs, setDialogs] = useState<IViewDialog[]>([]);

    const showDialog = (node: IViewDialog) => {
        setDialogs((prev) => [...prev, node]);
    };

    const closeDialog = () => {
        setDialogs((prev) => prev.slice(0, -1)); // pop thằng cuối
    };

    return (
        <DialogContext.Provider value={{ showDialog, closeDialog }}>
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
