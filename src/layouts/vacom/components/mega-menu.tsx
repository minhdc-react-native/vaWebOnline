import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/auth/context/auth-context';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useEffect, useState } from 'react';
import { VcMenu } from './vc-menu';
import { api } from '@/api/apiMethods';

export function VcMegaMenu() {
  const { currentApp } = useAuth();
  const [menus, setMenus] = useState<IData[]>([]);
  useEffect(() => {
    api.get({
      link: `/api/System/GetAppMenu?id=${currentApp?.id}`,
      callBack: (res) => setMenus(res)
    })
  }, [])
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-0">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to={'/'}
              className={cn('text-background focus:text-background hover:text-background hover:bg-transparent focus:bg-transparent ')}
              data-active={undefined}
            >
              <div style={{ backgroundColor: currentApp?.BACKGROUND_COLOR, borderRadius: 10 }}
                className={cn('font-bold flex flex-row justify-center items-center pr-2')}>
                <DynamicIcon name='chevron-left' />
                {currentApp?.NAME}
              </div>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <VcMenu menus={menus} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
