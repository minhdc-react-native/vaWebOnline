interface EmptyFieldProps {
    width?: string;
    height?: string;
    className?: string;
}
export function EmptyField({ width = "w-full", height = "h-6", className = "" }: EmptyFieldProps) {
    return (
        <div className={`${width} ${height} ${className}`} />
    );
}
