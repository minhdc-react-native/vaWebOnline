import { PropsWithChildren, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import { AuthModel, IYear, UserModel } from '@/auth/lib/models';
import { SupabaseAdapter } from '../adapters/supabase-adapter';
import { api } from '@/api/apiMethods';
import { getData, KEY_STORAGE, removeData, setData } from '@/lib/storage';
export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<Record<string, any> | undefined>(authHelper.getLoginInfo());

  const [listCurrentYear, setListCurrentYear] = useState<IYear[]>(getData(KEY_STORAGE.YEAR_LIST) ?? []);
  const [currentYear, setCurrentYear] = useState<string | null>(getData(KEY_STORAGE.YEAR_SELECTED) ?? null);

  const [infoDvcs, setInfoDvcs] = useState<Record<string, any> | null>(null);

  const [currentApp, setCurrentApp] = useState<IData | null>(null);

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      setData(KEY_STORAGE.TOKEN, auth.access_token);
      authHelper.setAuth(auth);
    } else {
      removeData(KEY_STORAGE.TOKEN);
      authHelper.removeAuth();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (data: Record<string, any>) => {
    const res = await api.post({
      link: `/api/Account/Login`,
      data: {
        username: data.username,
        pass: data.pass,
        dvcs: data.dvcs,
        captcha_token: ''
      },
      setLoading
    });
    if (res?.error) {
      throw res.error;
    } else {
      setCurrentYear(res.nam?.[0].NAM);
      setListCurrentYear(res.nam ?? []);
      saveAuth({ access_token: res.token });
      setCurrentUser(data);

      setData(KEY_STORAGE.YEAR_LIST, res.nam);

      setData(KEY_STORAGE.YEAR_SELECTED, res.nam?.[0].NAM);
      setData(KEY_STORAGE.ORG_UNIT, data.dvcs);
      if (data.remember) {
        authHelper.setLoginInfo(data);
      } else {
        authHelper.removeLoginInfo();
      }
    }
  };

  // ✅ Fake register cũng login luôn
  const register = async () => {

  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  const getUser = async (): Promise<Record<string, any> | null> => {
    try {
      return await SupabaseAdapter.getCurrentUser();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return currentUser ?? null;
    }
  };

  const updateProfile = async (userData: Partial<UserModel>) => {
    const updated = { ...currentUser, ...userData } as UserModel;
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        register,
        requestPasswordReset: async () => { },
        resetPassword: async () => { },
        resendVerificationEmail: async () => { },
        getUser,
        updateProfile,
        logout,
        verify: async () => { },
        isAdmin: true,
        currentYear,
        setCurrentYear,
        listCurrentYear: listCurrentYear,
        infoDvcs,
        setInfoDvcs,
        currentApp,
        setCurrentApp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
