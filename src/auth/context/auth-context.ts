import { createContext, useContext } from 'react';
import { AuthModel, IYear } from '@/auth/lib/models';

// Create AuthContext with types
export const AuthContext = createContext<{
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  auth?: AuthModel;
  saveAuth: (auth: AuthModel | undefined) => void;
  user?: Record<string, any>;
  setUser: React.Dispatch<React.SetStateAction<Record<string, any> | undefined>>;
  login: (values: Record<string, any>) => Promise<void>;
  register: (
    email: string,
    password: string,
    password_confirmation: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  getUser: () => Promise<Record<string, any> | null>;
  updateProfile: (userData: Partial<Record<string, any>>) => Promise<Record<string, any>>;
  logout: () => void;
  verify: () => Promise<void>;
  isAdmin: boolean;
  currentYear: string | null;
  setCurrentYear: (year: string) => void,
  listCurrentYear: IYear[];
  infoDvcs: Record<string, any> | null,
  setInfoDvcs: (info: Record<string, any>) => void;
  currentApp: IData | null;
  setCurrentApp: (app: IData) => void;
  currentMenu: IData[],
  setCurrentMenu: (menus: IData[]) => void;
  currentMenuSelected: IData | null,
  setCurrentMenuSelected: (menu: IData) => void;
}>({
  loading: false,
  setLoading: () => { },
  saveAuth: () => { },
  setUser: () => { },
  login: async () => { },
  register: async () => { },
  requestPasswordReset: async () => { },
  resetPassword: async () => { },
  resendVerificationEmail: async () => { },
  getUser: async () => null,
  updateProfile: async () => ({}) as Record<string, any>,
  logout: () => { },
  verify: async () => { },
  isAdmin: false,
  currentYear: null,
  setCurrentYear: (year: string) => { },
  listCurrentYear: [],
  infoDvcs: null,
  setInfoDvcs: (info: Record<string, any>) => { },
  currentApp: null,
  setCurrentApp: (app: IData) => { },
  currentMenu: [],
  setCurrentMenu: (menus: IData[]) => { },
  currentMenuSelected: null,
  setCurrentMenuSelected: (menu: IData) => { }
});

// Hook definition
export function useAuth() {
  return useContext(AuthContext);
}
