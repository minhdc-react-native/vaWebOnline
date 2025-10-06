import { Button } from "@/components/ui/button";
import { IButtonSchema } from "../interface";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useT } from "@/i18n/config";

export function ButtonField({
    btn,
    handleAction,
    className,
    disabled
}: {
    btn: IButtonSchema;
    handleAction: (action: string) => void;
    className?: string;
    disabled?: boolean;
}) {
    const _ = useT();
    const typeButton = btn.buttonType || "button";
    const isProcessing = btn.handleProcessing ? handleAction(btn.handleProcessing) : false;
    return (
        <Button
            type={btn.buttonType === "submit" ? "submit" : typeButton}
            variant={btn.variant}
            appearance={btn.appearance}
            className={cn(btn.className, className)}
            disabled={disabled || (isProcessing as boolean)}
            onClick={(e) => {
                if (typeButton === "button") {
                    e.preventDefault();
                    if (btn.handleClick) handleAction(btn.handleClick);
                }
            }}
        >
            {isProcessing ? (<span className="flex items-center gap-2">
                <LoaderCircleIcon className="h-4 w-4 animate-spin" /> {_(btn.labelLoading || btn.label)}
            </span>) : _(btn.label)}
        </Button>
    );
}