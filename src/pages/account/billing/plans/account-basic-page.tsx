import { Fragment } from 'react';
import {
  VcToolbar,
  VcToolbarActions,
  VcToolbarHeading,
} from '@/layouts/vacom/components/toolbar';
import { PageNavbar } from '@/pages/account';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { AccountPlansContent } from '.';

export function AccountPlansPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      <PageNavbar />
      {settings?.layout === 'vacom' && (
        <Container>
          <VcToolbar>
            <VcToolbarHeading
              title="Plans"
              description="Central Hub for Personal Customization"
            />
            <VcToolbarActions>
              <Button variant="outline">View Billing</Button>
            </VcToolbarActions>
          </VcToolbar>
        </Container>
      )}
      <Container>
        <AccountPlansContent />
      </Container>
    </Fragment>
  );
}
