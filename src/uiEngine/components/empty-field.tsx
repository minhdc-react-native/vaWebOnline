interface EmptyFieldProps {
    width?: number;
    height?: string;
    className?: string;
}
export function EmptyField({ width, height = "h-6", className = "" }: EmptyFieldProps) {
    return (
        <div style={{ width: width }} className={`${height} ${className}`} />
    );
}
