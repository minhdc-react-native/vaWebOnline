import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDataGrid } from "@/components/ui/data-grid";
import { useT } from "@/i18n/config";
import { DynamicIcon } from "lucide-react/dynamic";

export function RowContextMenu<T extends IData>({
  row,
  children,
}: {
  row: T;
  children: React.ReactNode;
}) {
  const _ = useT();
  const { props } = useDataGrid();
  const { onContext, permission, addMenu } = (props.onContextMenu || {});
  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={() => props.onRowClick?.(row)} asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem onClick={() => onContext?.('Refresh', row)}>
          <DynamicIcon name="refresh-ccw" className="pr-2" />
          {_('REFRESH')}
        </ContextMenuItem>
        {permission?.new && <ContextMenuItem onClick={() => onContext?.('New', row)}>
          <DynamicIcon name="plus" className="pr-2" />
          {_('THEM')}
        </ContextMenuItem>}
        {permission?.edit && <ContextMenuItem onClick={() => onContext?.('Edit', row)}>
          <DynamicIcon name="edit" className="pr-2" />
          {_('SUA')}
        </ContextMenuItem>}
        {permission?.delete && <ContextMenuItem onClick={() => onContext?.('Delete', row)}>
          <DynamicIcon name="delete" className="pr-2" />
          {_('XOA')}
        </ContextMenuItem>}
        {permission?.new && <ContextMenuItem onClick={() => onContext?.('Copy', row)}>
          <DynamicIcon name="copy" className="pr-2" />
          {_('COPY')}
        </ContextMenuItem>}
        {addMenu && addMenu.length > 0 && <ContextMenuSeparator />}
        {addMenu && addMenu.map(m => {
          return (
            <ContextMenuItem key={m.id} onClick={() => onContext?.(m.id.toString(), row)}>
              <DynamicIcon name={m.icon} className="pr-2" />
              {_(m.title)}
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  );
}
