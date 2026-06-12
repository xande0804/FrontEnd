import { createContext } from 'react';

type AuthContextProps = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const initialContextValue: AuthContextProps = {
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialContextValue);