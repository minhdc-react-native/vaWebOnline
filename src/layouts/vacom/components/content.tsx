import { Outlet } from 'react-router';
import { useIsMobile } from '@/hooks/use-mobile';
import { Container } from '@/components/common/container';
import { VcBreadcrumb } from './breadcrumb';

export function VcContent() {
  const mobile = useIsMobile();

  return (
    <div className="grow content pt-5" role="content">
      {mobile && (
        <Container>
          <VcBreadcrumb />
        </Container>
      )}
      <Outlet />
    </div>
  );
}
