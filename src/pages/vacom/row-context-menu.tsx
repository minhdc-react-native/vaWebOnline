import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDataGrid } from "@/components/ui/data-grid";

export function RowContextMenu<T extends IData>({
  row,
  children,
}: {
  row: T;
  children: React.ReactNode;
}) {
  const { props } = useDataGrid();
  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={() => props.onRowClick?.(row)} asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onClick={() => props.onContextMenu?.('View', row)}>👁 View</ContextMenuItem>
        <ContextMenuItem onClick={() => props.onContextMenu?.('Edit', row)}>✏️ Edit</ContextMenuItem>
        <ContextMenuItem onClick={() => props.onContextMenu?.('Delete', row)}>🗑 Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
