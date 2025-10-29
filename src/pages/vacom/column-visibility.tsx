import { useRef, useState, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Cog, GripVertical } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ColumnVisibilityButtonProps {
    table: Table<any>;
}

export function ColumnVisibilityButton({ table }: ColumnVisibilityButtonProps) {
    const [open, setOpen] = useState(false);
    const [txtSearch, setTextSearch] = useState("");

    // 🧠 Tạo danh sách cột ổn định riêng cho drag
    const [columns, setColumns] = useState(() =>
        table.getAllLeafColumns().filter((col) => col.getCanHide())
    );

    const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
        setColumns((prevCols) => {
            const newCols = [...prevCols];
            const [moved] = newCols.splice(dragIndex, 1);
            newCols.splice(hoverIndex, 0, moved);
            return newCols;
        });
    }, []);

    const handleDragEnd = useCallback(() => {
        // ✅ Cập nhật lại thứ tự cột trong bảng khi thả chuột
        table.setColumnOrder(columns.map((c) => c.id));
    }, [columns, table]);

    const filteredCols = columns.filter((col) =>
        `${col.id}${col.columnDef.header ?? ""}`
            .toLowerCase()
            .includes(txtSearch.toLowerCase())
    );

    const handleSizeChange = (id: string, size: number) => {
        table.setColumnSizing(prev => ({ ...prev, [id]: size }));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button className="px-3 py-1 border rounded-md flex items-center gap-1 hover:bg-accent">
                        <Cog className="w-4 h-4" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="w-[400px] bg-popover border rounded-md shadow-lg p-2"
                >
                    <Input
                        placeholder="Tìm kiếm"
                        value={txtSearch}
                        onChange={(e) => setTextSearch(e.target.value)}
                        className="mb-2 h-8"
                    />

                    <ScrollArea className="max-h-[350px]" style={{ height: 350 }}>
                        <div className="space-y-1">
                            {filteredCols.map((column, index) => (
                                <DraggableColumnItem
                                    key={column.id}
                                    column={column}
                                    index={index}
                                    moveColumn={handleReorder}
                                    handleSizeChange={handleSizeChange}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </DndProvider>
    );
}

function DraggableColumnItem({
    column,
    index,
    moveColumn,
    handleSizeChange,
    onDragEnd
}: {
    column: any;
    index: number;
    moveColumn: (dragIndex: number, hoverIndex: number) => void;
    handleSizeChange: (id: string, size: number) => void;
    onDragEnd: () => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    const [{ isDragging }, dragRef] = useDrag({
        type: "COLUMN_ITEM",
        item: { index },
        end: onDragEnd,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: "COLUMN_ITEM",
        hover(item: any) {
            if (item.index === index) return;
            moveColumn(item.index, index);
            item.index = index;
        },
    });

    dragRef(dropRef(ref));

    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition",
                isDragging && "opacity-50 bg-muted/40"
            )}
        >
            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

            <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
            />

            <span className="flex-1 truncate">
                {column.columnDef.header ?? column.id}
            </span>

            <input
                type="number"
                min={20}
                max={1000}
                defaultValue={column.columnDef.size ?? 100}
                onBlur={(e) => {
                    const val = Number(e.target.value);
                    column.columnDef.size = val;
                    handleSizeChange(column.id, val);
                }}
                className="w-20 h-7 text-sm border rounded px-1 text-right"
            />
        </div>
    );
}
