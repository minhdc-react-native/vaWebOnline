import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useBodyClass } from '@/hooks/use-body-class';
import { useMenu } from '@/hooks/use-menu';
import { useSettings } from '@/providers/settings-provider';
import { VcHeader } from './components/header';

export function VacomLayout() {
  const { setOption } = useSettings();
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR);

  // Using the custom hook to set multiple CSS variables and class properties
  useBodyClass(`
    [--header-height-default:140px]
    data-[sticky-header=on]:[--header-height:140px]
    [--header-height:var(--header-height-default)]	
    [--header-height-mobile:70px]	
  `);

  useEffect(() => {
    setOption('layout', 'vacom');
  }, [setOption]);

  return (
    <>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>
      <div className="flex flex-col h-screen overflow-hidden">
        <div
          className="shrink-0"
          style={{ height: 'var(--header-height)' }}
        >
          <VcHeader />
        </div>
        <div className="flex-1 overflow-auto bg-muted/10" role="content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
