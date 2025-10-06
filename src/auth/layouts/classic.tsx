import { Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { SlideAds } from '../pages/slide-ads';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/providers/i18n-provider';
import { useTheme } from 'next-themes';
import { Language } from '@/i18n/types';
import { I18N_LANGUAGES, useT } from '@/i18n/config';

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
      <div className="min-h-screen flex flex-col w-full">
        <AuthHeader />
        <div className="grid lg:grid-cols-2 grow bg-no-repeat page-bg">
          <div className="hidden lg:flex flex-col items-center justify-center grow bg-center p-[50px]" >
            <SlideAds />
          </div>
          <div className="flex flex-col items-center justify-center grow bg-center">
            <Card className="w-full max-w-[400px]">
              <CardContent className="p-6">
                <Outlet />
              </CardContent>
            </Card>
          </div>
        </div>
        <AuthFooter />
      </div>
    </>
  );
}


function AuthHeader() {
  const { currenLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const _ = useT();
  const handleLanguage = (lang: Language) => {
    changeLanguage(lang);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };
  return (
    <header className="w-full flex items-center justify-between px-6 py-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img
          src={toAbsoluteUrl("/media/app/LogoVacom.png")}
          alt="Logo"
          className="h-10"
        />
        {/* <span className="text-lg font-semibold">Accounting</span> */}
      </div>
      {/* Language selector */}

      <div className="flex flex-row justify-center items-center gap-2">
        <Select onValueChange={(value) => {
          const selectedLang = I18N_LANGUAGES.find(
            (lang) => lang.code === value,
          );
          if (selectedLang) handleLanguage(selectedLang);
        }} value={currenLanguage.code}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {I18N_LANGUAGES.map((item) => (
              <SelectItem
                key={item.code}
                value={item.code}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.flag}
                    className="w-4 h-4 rounded-full"
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 justify-between grow">
          {_('Dark mode')}
          <Switch
            size="sm"
            checked={theme === 'dark'}
            onCheckedChange={handleThemeToggle}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-2 border-l border-gray-300 pl-4">
          {/* 📞 Phone */}
          <div className="flex items-center gap-2 text-destructive font-semibold">
            <Phone className="w-4 h-4" strokeWidth={2.5} />
            <span>0931 133 233</span>
          </div>

          {/* ✉️ Email */}
          <div className="flex items-center gap-2 text-green-700">
            <Mail className="w-4 h-4" strokeWidth={2.5} />
            <a
              href="mailto:info@vacom.com.vn"
              className="hover:underline font-medium"
            >
              info@vacom.com.vn
            </a>
          </div>
        </div>
      </div>

    </header>
  );
}

function AuthFooter() {
  return (
    <footer className="w-full text-center py-4 text-sm text-muted-foreground border-t mt-auto">
      © {new Date().getFullYear()} VACOM.,JSC. All rights reserved.
    </footer>
  );
}