import { PropsWithChildren, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import { AuthModel, IYear, UserModel } from '@/auth/lib/models';
import { SupabaseAdapter } from '../adapters/supabase-adapter';
import { api } from '@/api/apiMethods';
import { KEY_STORAGE, removeData, setData } from '@/lib/storage';
export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<Record<string, any> | undefined>();
  const [currentYear, setCurrentYear] = useState<string | null>(null);
  const [listCurrentYear, setListCurrentYear] = useState<IYear[]>([]);

  const [infoDvcs, setInfoDvcs] = useState<Record<string, any> | null>(null);

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
      setData(KEY_STORAGE.YEAR_SELECTED, res.nam?.[0].NAM);
      setData(KEY_STORAGE.ORG_UNIT, data.dvcs);
      if (data.remember) {
        authHelper.setLoginInfo(data);
      } else {
        authHelper.removeLoginInfo();
      }
    }
    await api.get({
      link: `/api/System/GetInfoDvcs`,
      callBack: (res: IData[]) => {
        if (res && res.length > 0) setInfoDvcs(res[0]);
      }
    });
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
        listCurrentYear: listCurrentYear,
        infoDvcs
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
