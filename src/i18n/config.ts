import { toAbsoluteUrl } from '@/lib/helpers';
import viMessages from './messages/vi.json';
import arMessages from './messages/ar.json';
import enMessages from './messages/en.json';
import frMessages from './messages/fr.json';
import zhMessages from './messages/zh.json';
import { type Language } from './types';

import { useIntl } from "react-intl";

const I18N_MESSAGES = {
  vi: viMessages,
  en: enMessages,
  ar: arMessages,
  fr: frMessages,
  zh: zhMessages,
};

const I18N_CONFIG_KEY = 'i18nConfig';

const I18N_LANGUAGES: Language[] = [
  {
    label: 'Tiếng Việt',
    code: 'vi',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/vietnam.svg'),
    messages: I18N_MESSAGES.vi,
  },
  {
    label: 'English',
    code: 'en',
    direction: 'ltr',
    flag: toAbsoluteUrl('/media/flags/united-states.svg'),
    messages: I18N_MESSAGES.en,
  },
  // {
  //   label: 'Arabic (Saudi)',
  //   code: 'ar',
  //   direction: 'rtl',
  //   flag: toAbsoluteUrl('/media/flags/saudi-arabia.svg'),
  //   messages: I18N_MESSAGES.ar,
  // },
  // {
  //   label: 'French',
  //   code: 'fr',
  //   direction: 'ltr',
  //   flag: toAbsoluteUrl('/media/flags/france.svg'),
  //   messages: I18N_MESSAGES.fr,
  // },
  // {
  //   label: 'Chinese',
  //   code: 'zh',
  //   direction: 'ltr',
  //   flag: toAbsoluteUrl('/media/flags/china.svg'),
  //   messages: I18N_MESSAGES.zh,
  // },
];

const I18N_DEFAULT_LANGUAGE: Language = I18N_LANGUAGES[0];

export {
  I18N_CONFIG_KEY,
  I18N_DEFAULT_LANGUAGE,
  I18N_LANGUAGES,
  I18N_MESSAGES,
};

export function useT() {
  const { formatMessage } = useIntl();
  return (id?: string, values?: Record<string, any>) => {
    if (!id) return id;
    try {
      return formatMessage({ id }, values);
    } catch (e) {
      console.warn("Missing i18n key:", id);
      return id;
    }
  };
}