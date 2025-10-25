import { Input } from "@/components/ui/input";

interface IProgs {
    value: any;
    onChange: (value: string | number) => void;
    onBlur: () => void;
}
export function InputEditor({ value, onChange, onBlur }: IProgs) {
    return <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="border-none"
        style={{ width: "100%" }}
    />
}