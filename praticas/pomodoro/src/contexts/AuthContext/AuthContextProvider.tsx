import { useCallback, useMemo, useState } from 'react';
import { AuthContext, type AuthUser } from './AuthContext';
import { loginUser } from '../../services/api';

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const STORAGE_KEY = 'kratos-auth';

type AuthStorage = {
  token: string;
  user: AuthUser;
};

export function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [authData, setAuthData] =
    useState<AuthStorage | null>(() => {
      const storedData =
        sessionStorage.getItem(STORAGE_KEY);

      if (!storedData) return null;

      return JSON.parse(storedData);
    });

  const login = useCallback(
    async (
      email: string,
      password: string,
    ) => {
      try {
        const data = await loginUser({
          email,
          password,
        });

        const authStorage: AuthStorage = {
          token: data.token,
          user: data.user,
        };

        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(authStorage),
        );

        setAuthData(authStorage);

        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthData(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!authData,
      user: authData?.user ?? null,
      login,
      logout,
    }),
    [authData, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}