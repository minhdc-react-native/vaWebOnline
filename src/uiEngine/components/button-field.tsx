import { Button } from "@/components/ui/button";
import { IButtonSchema } from "../interface";

export function ButtonField({
    btn,
    handleAction,
    className
}: {
    btn: IButtonSchema;
    handleAction: (action: string) => void;
    className?: string
}) {
    const typeButton = btn.buttonType || "button";
    return (
        <Button
            type={btn.buttonType === "submit" ? "submit" : typeButton}
            variant={btn.variant}
            className={`${btn.className || ''} ${className || ''}`}
            onClick={(e) => {
                if (typeButton === "button") {
                    e.preventDefault();
                    if (btn.onClick) handleAction(btn.onClick);
                }
            }}
        >
            {btn.label}
        </Button>
    );
}