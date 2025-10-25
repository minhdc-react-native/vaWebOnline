interface IProgs {
    value: any;
    onChange: (value: string | number) => void;
    onBlur: () => void;
}
export function RatingEditor({ value, onChange, onBlur }: IProgs) {
    return <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={{ width: "100%" }}
    />
}