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
import { VcMenu } from './vc-menu';
export function VcMegaMenu() {
  const { currentApp } = useAuth();
  return (
    <div className='flex flex-row row-span-1 justify-between items-center'>
      <NavigationMenu>
        <NavigationMenuList className="gap-0">
          <NavigationMenuItem style={{ backgroundColor: currentApp?.BACKGROUND_COLOR, borderRadius: 10 }}>
            <NavigationMenuLink asChild>
              <Link
                to={'/'}
                className={cn('text-background focus:text-background hover:text-background hover:bg-transparent focus:bg-transparent ')}
              >
                <div
                  className={cn('font-bold flex flex-row justify-center items-center pr-2')}>
                  <DynamicIcon name='chevron-left' />
                  {currentApp?.NAME}
                </div>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <VcMenu />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
