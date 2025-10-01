import { Link, Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { SlideAds } from '../pages/slide-ads';

export function ClassicLayout() {
  return (
    <>
      <style>
        {`
          .page-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-7.png')}');
          }
          .dark .page-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-10-dark.png')}');
          }
        `}
      </style>
      <div className="grid lg:grid-cols-2 grow bg-no-repeat page-bg">
        <div className="hidden lg:flex flex-col items-center justify-center grow bg-center p-[50px]" >
          <SlideAds />
        </div>
        <div className="flex flex-col items-center justify-center grow bg-center">
          {/* <div className="m-5">
            <Link to="/">
              <img
                src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                className="h-[35px] max-w-none"
                alt=""
              />
            </Link>
          </div> */}
          <Card className="w-full max-w-[400px]">
            <CardContent className="p-6">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
