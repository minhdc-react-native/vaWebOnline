'use client';

import { toAbsoluteUrl } from '@/lib/helpers';

export function ScreenLoader({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center
                  bg-background/5 backdrop-blur-sm z-50 transition-opacity duration-500
                  ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <img
        className="h-[40px] mb-3 animate-bounce"
        src={toAbsoluteUrl('/media/app/mini-logo.svg')}
        alt="logo"
      />
      <div className="text-muted-foreground font-medium text-sm">Loading...</div>
    </div>
  );
}