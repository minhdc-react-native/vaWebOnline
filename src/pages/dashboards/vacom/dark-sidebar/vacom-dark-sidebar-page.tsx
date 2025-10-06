import { Fragment, useState } from 'react';
import {
  VcToolbar,
  VcToolbarActions,
  VcToolbarHeading,
} from '@/layouts/vacom/components/toolbar';
import { addDays, format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Container } from '@/components/common/container';
import { VacomLightSidebarContent } from '../light-sidebar';

const VacomDarkSidebarPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  return (
    <Fragment>
      <Container>
        <VcToolbar>
          <VcToolbarHeading
            title="Dashboard"
            description="Central Hub for Personal Customization"
          />
          <VcToolbarActions>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant="outline" size="sm">
                  <CalendarDays size={16} className="me-0.5" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </VcToolbarActions>
        </VcToolbar>
      </Container>
      <Container>
        <VacomLightSidebarContent />
      </Container>
    </Fragment>
  );
};

export { VacomDarkSidebarPage };
