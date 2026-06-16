import { createContext } from 'react';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthContextProps = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
};

const initialContextValue: AuthContextProps = {
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
};

export const AuthContext =
  createContext<AuthContextProps>(
    initialContextValue,
  );