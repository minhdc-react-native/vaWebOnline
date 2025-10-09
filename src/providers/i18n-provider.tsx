import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  I18N_CONFIG_KEY,
  I18N_DEFAULT_LANGUAGE,
  I18N_LANGUAGES,
  I18N_MESSAGES,
} from '@/i18n/config';
import { I18nProviderProps, type Language } from '@/i18n/types';
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';
import { IntlProvider } from 'react-intl';
import { getData, KEY_STORAGE, setData } from '@/lib/storage';
import { toAbsoluteUrl } from '@/lib/helpers';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/de';
import '@formatjs/intl-relativetimeformat/locale-data/es';
import '@formatjs/intl-relativetimeformat/locale-data/fr';
import '@formatjs/intl-relativetimeformat/locale-data/ja';
import '@formatjs/intl-relativetimeformat/locale-data/zh';
import { api } from '@/api/apiMethods';

// Hàm lấy ngôn ngữ khởi tạo
const getInitialLanguage = (): Language => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');

  if (langParam) {
    const matched = I18N_LANGUAGES.find((l) => l.code === langParam);
    if (matched) {
      setData(I18N_CONFIG_KEY, matched);
      return matched;
    }
  }

  const saved = getData(I18N_CONFIG_KEY) as Language | undefined;

  return saved ?? I18N_DEFAULT_LANGUAGE;
};

// ----------------------
// Provider chính
// ----------------------
const TranslationsContext = createContext<I18nProviderProps>({
  currenLanguage: getInitialLanguage(),
  changeLanguage: () => { },
  isRTL: () => false,
});

export const useLanguage = () => useContext(TranslationsContext);

export const I18nProvider = ({ children }: PropsWithChildren) => {
  const [currenLanguage, setCurrenLanguage] = useState<Language>(getInitialLanguage());
  const [loading, setLoading] = useState(false);
  const fetchLanguageMessages = async (langCode: string, refresh?: boolean): Promise<Record<string, string>> => {
    const cacheKey = `langMessageAdd_${langCode}`;
    const cached = getData(cacheKey);
    if (cached && !refresh) {
      return cached;
    }
    const res = await api.get({ link: `/api/System/GetLanguagesByMa?lang=${langCode}` });
    const dict: Record<string, string> = {};
    res.forEach((item: any) => {
      dict[item.KEY_LANG] = item.VALUES_LANG;
    });
    setData(cacheKey, dict);
    return dict;
  };

  // 🔹 Khi đổi ngôn ngữ
  const changeLanguage = async (language: Language) => {
    try {
      setLoading(true);
      const newMessages = await fetchLanguageMessages(language.code, true);
      // Cập nhật I18N_MESSAGES toàn cục
      (I18N_MESSAGES as any)[language.code] = {
        ...I18N_MESSAGES[language.code],
        ...newMessages,
      };

      const updatedLang: Language = {
        ...language,
        messages: I18N_MESSAGES[language.code],
        flag: language.flag || toAbsoluteUrl(`/media/flags/${language.code}.svg`),
        direction: language.direction ?? 'ltr',
      };

      // Lưu lại config hiện tại
      setData(I18N_CONFIG_KEY, updatedLang);
      setData(KEY_STORAGE.LANG_SELECTED, updatedLang.code);
      setCurrenLanguage(updatedLang);
    } catch (err) {
      console.error('Error changing language:', err);
    } finally {
      setLoading(false);
    }
  };

  const isRTL = () => currenLanguage.direction === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', currenLanguage.direction);
  }, [currenLanguage]);
  return (
    <TranslationsContext.Provider value={{ currenLanguage, changeLanguage, isRTL }}>
      <IntlProvider
        messages={currenLanguage.messages}
        locale={currenLanguage.code}
        defaultLocale={I18N_DEFAULT_LANGUAGE.code}
        onError={(err) => {
          if (err.code === 'MISSING_TRANSLATION') return;
          throw err;
        }}
      >
        <RadixDirectionProvider dir={currenLanguage.direction}>
          {loading ? <div>Loading language...</div> : children}
        </RadixDirectionProvider>
      </IntlProvider>
    </TranslationsContext.Provider>
  );
};
