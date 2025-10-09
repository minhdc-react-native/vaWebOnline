import { ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { useVcMenu } from './useVcMenu';
import { useEffect } from 'react';
import { useGlobalDialog } from '@/providers/global-dialog';
import { useAuth } from '@/auth/context/auth-context';

export function VcMenu() {
    const { pathname } = useLocation();
    const { currentMenu: menus } = useAuth();
    const { showDialog } = useGlobalDialog();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent, item: IData) => {
        if (item.code === "customview_win") {
            e.preventDefault();
            showDialog({
                title: 'customview_win',
                content: <div><span dangerouslySetInnerHTML={{ __html: item.value ?? "" }} /></div>
            })
        }
    };

    const { isActive, hasActiveChild } = useVcMenu(pathname);

    const buildMenu = (items: IData[]) => {
        return items.map((item, index) => {
            const path = `/app/${item.code}/${item.window_id}`;
            if (item.submenu) {
                return (
                    <MenubarMenu key={item.id}>
                        <MenubarTrigger
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-3.5 text-sm text-secondary-foreground text-nowrap',
                                'rounded-none border-b-2 border-transparent bg-transparent!',
                                'hover:text-mono hover:bg-transparent',
                                'focus:text-mono focus:bg-transparent',
                                'data-[state=open]:bg-transparent data-[state=open]:text-mono',
                                'data-[here=true]:text-mono data-[here=true]:border-mono',
                            )}
                            data-active={isActive(path) || undefined}
                            data-here={hasActiveChild(item.submenu) || undefined}
                        >
                            <span dangerouslySetInnerHTML={{ __html: item.value ?? "" }} />
                            <ChevronDown className="ms-auto size-3.5" />
                        </MenubarTrigger>
                        <MenubarContent className="min-w-[175px]" sideOffset={0}>
                            {buildSubMenu(item.submenu)}
                        </MenubarContent>
                    </MenubarMenu>
                );
            } else {
                return (
                    <MenubarMenu key={item.id}>
                        <MenubarTrigger
                            asChild
                            className={cn(
                                'flex items-center px-2 py-3.5 text-sm text-secondary-foreground px-3 text-nowrap',
                                'rounded-none border-b-2 border-transparent bg-transparent!',
                                'hover:text-mono hover:bg-transparent',
                                'focus:text-mono focus:bg-transparent',
                                'data-[active=true]:text-mono data-[active=true]:border-mono',
                            )}
                        >
                            <Link
                                to={item.code === "customview_win" ? "#" : path || ""}
                                onClick={(e) => handleClick(e, item)}
                                data-active={isActive(path) || undefined}
                                data-here={hasActiveChild(item.submenu) || undefined}
                            >
                                <span dangerouslySetInnerHTML={{ __html: item.value ?? "" }} />
                            </Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                );
            }
        });
    };

    const buildSubMenu = (items: IData[]) => {
        return items.map((item, index) => {
            const path = `/app/${item.code}/${item.window_id}`;
            if (item.submenu) {
                return (
                    <MenubarSub key={item.id}>
                        <MenubarSubTrigger
                            data-active={isActive(path) || undefined}
                            data-here={hasActiveChild(item.submenu) || undefined}
                        >
                            <span dangerouslySetInnerHTML={{ __html: item.value ?? "" }} />
                        </MenubarSubTrigger>
                        <MenubarSubContent className="min-w-[175px]">
                            {buildSubMenu(item.submenu)}
                        </MenubarSubContent>
                    </MenubarSub>
                );
            } else {
                return (
                    <MenubarItem
                        key={item.id}
                        asChild
                        data-active={isActive(path) || undefined}
                        data-here={hasActiveChild(item.submenu) || undefined}
                    >
                        <Link
                            to={item.code === "customview_win" ? "#" : path || ""}
                            onClick={(e) => handleClick(e, item)}
                        >
                            <span dangerouslySetInnerHTML={{ __html: item.value ?? "" }} />
                        </Link>
                    </MenubarItem>
                );
            }
        });
    };

    return (
        <div className="grid">
            <div className="kt-scrollable-x-auto">
                <Menubar className="flex items-stretch border-none bg-transparent p-0 h-auto">
                    {buildMenu(menus)}
                </Menubar>
            </div>
        </div>
    );
}
