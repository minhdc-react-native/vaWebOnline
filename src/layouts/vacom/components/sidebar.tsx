import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { VcSidebarHeader } from './sidebar-header';
import { VcSidebarMenu } from './sidebar-menu';

export function VcSidebar() {
  const { settings } = useSettings();
  const { pathname } = useLocation();

  return (
    <div
      className={cn(
        'sidebar bg-background lg:border-e lg:border-border lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0',
        (settings.layouts.vacom.sidebarTheme === 'dark' ||
          pathname.includes('dark-sidebar')) &&
        'dark',
      )}
    >
      <VcSidebarHeader />
      <div className="overflow-hidden">
        <div className="w-(--sidebar-default-width)">
          <VcSidebarMenu />
        </div>
      </div>
    </div>
  );
}
