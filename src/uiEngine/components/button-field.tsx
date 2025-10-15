import { Button } from "@/components/ui/button";
import { IButtonSchema } from "../interface";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useT } from "@/i18n/config";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "lucide-react/dynamic";

export function ButtonField({
    btn,
    handleAction,
    className,
    disabled,
    isProcessing = false
}: {
    btn: IButtonSchema;
    handleAction: (action: string) => void;
    className?: string;
    disabled?: boolean;
    isProcessing?: boolean;
}) {
    const _ = useT();
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [pressed, setPressed] = useState(false);
    const typeButton = btn.buttonType || "button";
    const onPressStyle = () => {
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
    }
    useEffect(() => {
        if (!btn.hotkey) return;
        const handler = (e: KeyboardEvent) => {
            const key = e.key?.toLowerCase();
            const hk = btn.hotkey!.toLowerCase();
            const match =
                (hk.includes("ctrl") ? e.ctrlKey : true) &&
                (hk.includes("alt") ? e.altKey : true) &&
                (hk.includes("shift") ? e.shiftKey : true) &&
                key === (hk.includes("+") ? hk.split("+").pop() : hk)?.trim();

            if (!match || disabled || isProcessing) return;

            const button = buttonRef.current;
            if (!button) return;
            const form = button.closest("form");
            const activeForm = document.activeElement?.closest("form");
            const isInForm = !!form;
            if (form && activeForm && form !== activeForm) return;

            e.preventDefault();

            onPressStyle();

            switch (typeButton) {
                case "submit":
                    if (isInForm) {
                        form!.requestSubmit(button);
                    } else {
                        if (btn.handleClick) handleAction(btn.handleClick);
                    }
                    break;
                case "reset":
                    if (isInForm) form!.reset();
                    break;
                default:
                    if (btn.handleClick) handleAction(btn.handleClick);
                    break;
            }

        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [btn.hotkey, disabled, isProcessing, handleAction, btn.handleClick, typeButton]);
    return (
        <Button
            ref={buttonRef}
            type={btn.buttonType === "submit" ? "submit" : typeButton}
            variant={btn.variant}
            autoFocus={btn.autoFocus}
            appearance={btn.appearance}
            className={cn(
                btn.className,
                className,
                pressed && "scale-[0.97] transition-all",
                'min-w-[100px]'
            )}
            disabled={disabled || (isProcessing as boolean)}
            onClick={(e) => {
                if (typeButton === "button") {
                    onPressStyle();
                    e.preventDefault();
                    if (btn.handleClick) handleAction(btn.handleClick);
                }
            }}
        >
            {btn.iconLeft && <DynamicIcon
                name={btn.iconLeft}
                size={18}
            />}
            {isProcessing ? (<span className="flex items-center gap-2">
                <LoaderCircleIcon className="h-4 w-4 animate-spin" /> {_(btn.labelLoading || btn.label)}
            </span>) : _(btn.label)}
            {btn.hotkey && <Badge variant={"destructive"} appearance="light" size="xs">{btn.hotkey}</Badge>}
        </Button>
    );
}