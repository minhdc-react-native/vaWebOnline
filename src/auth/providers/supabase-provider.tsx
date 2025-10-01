import { PropsWithChildren, useEffect, useState } from 'react';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';
import { AuthModel, UserModel } from '@/auth/lib/models';
import { SupabaseAdapter } from '../adapters/supabase-adapter';

// Fake user
const demoUser: UserModel = {
  id: 'demo',
  username: 'Demo',
  email: 'demo@kt.com',
  first_name: 'Demo',
  last_name: 'User',
  is_admin: true,
};

const demoAuth: AuthModel = {
  access_token: 'fake-token-123',
  refresh_token: 'fake-refresh-123'
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(
    demoUser
  );
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    setIsAdmin(currentUser?.is_admin === true);
  }, [currentUser]);

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  // ✅ Fake login luôn thành công
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string) => {
    saveAuth(demoAuth);
    setCurrentUser(demoUser);
  };

  // ✅ Fake register cũng login luôn
  const register = async (
    email: string,
    password: string,
    password_confirmation: string,
    firstName?: string,
    lastName?: string
  ) => {
    saveAuth(demoAuth);
    setCurrentUser({
      ...demoUser,
      email,
      first_name: firstName || 'New',
      last_name: lastName || 'User',
    });
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  const getUser = async (): Promise<UserModel | null> => {
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
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
