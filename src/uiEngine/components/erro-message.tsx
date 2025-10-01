import { useFormField } from "@/components/ui/form";
import { cn } from '@/lib/utils';
const styleClass = `
    absolute right-0 bottom-[-8px]
    bg-destructive text-white 
    text-[10px] leading-tight
    border border-gray-300 
    rounded-md px-2 py-[2px]
    shadow-md
    whitespace-nowrap
    `;

export function ErrorMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
        return null;
    }

    return (
        <div
            data-slot="form-message"
            id={formMessageId}
            className={cn('-mt-0.5 text-xs font-normal text-destructive', `${styleClass} ${className}`)}
            {...props}
        >
            {body}
        </div>
    );
}