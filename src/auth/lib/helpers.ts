import { getData, setData } from '@/lib/storage';
import { AuthModel } from './models';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${import.meta.env.VITE_APP_VERSION || '1.0'
  }`;
const AUTH_REMEMBER = `${import.meta.env.VITE_APP_NAME}-remember-v${import.meta.env.VITE_APP_VERSION || '1.0'
  }`
/**
 * Get stored auth information from local storage
 */
const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;
    return auth;
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

/**
 * Save auth information to local storage
 */
const setAuth = (auth: AuthModel) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

/**
 * Remove auth information from local storage
 */
const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

const getLoginInfo = (): Record<string, any> | undefined => {
  try {
    const auth = getData(AUTH_REMEMBER) as Record<string, any> | undefined;
    return auth;
  } catch (error) {
    return {};
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setLoginInfo = (data: Record<string, any>) => {
  setData(AUTH_REMEMBER, data);
};

const removeLoginInfo = () => {
  if (!localStorage) {
    return;
  }
  try {
    localStorage.removeItem(AUTH_REMEMBER);
  } catch (error) {
    console.error('REMEMBER LOGIN INFO LOCAL STORAGE REMOVE ERROR', error);
  }
};

export {
  AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth,
  getLoginInfo, setLoginInfo, removeLoginInfo
};
