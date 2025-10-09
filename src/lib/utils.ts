import { api } from '@/api/apiMethods';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getData, removeData, setData } from './storage';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
interface IProgsCacheItem {
  cacheKey: string;
  url: string;
  method?: 'get' | 'post';
  callBack: (res: any) => void;
  setLoading?: (loading: boolean) => void
}

const keyCacheBegin = 'app-vacom-config:';
export function getCacheItem({ cacheKey, url, method = "get", callBack, setLoading }: IProgsCacheItem) {
  const cacheKeyFull = `${keyCacheBegin}${cacheKey}`;
  const value = getData(cacheKeyFull);
  if (!value) {
    api[method]({
      link: url,
      callBack: (res) => {
        setData(cacheKeyFull, res);
        callBack(res);
      },
      setLoading
    });
  } else {
    callBack(value);
  }
}
export const removeAllCacheItem = async (callBack: (isProgress: boolean) => void) => {
  callBack(true);
  try {
    await api.post({
      link: `/api/System/ClearCache`
    });
  } catch (error) { }

  Object.keys(localStorage).map(key => {
    if (key.startsWith(keyCacheBegin)) {
      try { removeData(key); } catch (error) { }
    }
  });
  callBack(false);
}