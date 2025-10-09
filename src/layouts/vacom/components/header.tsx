import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Container } from '@/components/common/container';
import { VcMegaMenu } from './mega-menu';
import { AppHeader } from '@/pages/vacom/app-header';

export function VcHeader() {

  const scrollPosition = useScrollPosition();
  const headerSticky: boolean = scrollPosition > 0;

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-transparent bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        'border-b border-border',
      )}
    >
      <div className='flex flex-col w-full'>
        <AppHeader />
        <hr />
        <Container className="flex justify-between items-stretch lg:gap-4">
          <VcMegaMenu />
        </Container>
      </div>
    </header>
  );
}
