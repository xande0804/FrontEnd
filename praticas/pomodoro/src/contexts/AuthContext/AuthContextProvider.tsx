import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { validateMockLogin } from '../../utils/validateMockLogin';

type AuthContextProviderProps = {
children: React.ReactNode;
};

const STORAGE_KEY = 'kratos-auth';

export function AuthContextProvider({
children,
}: AuthContextProviderProps) {
const [isAuthenticated, setIsAuthenticated] = useState(
() => sessionStorage.getItem(STORAGE_KEY) === '1',
);

const login = useCallback(
(username: string, password: string) => {
const isValid = validateMockLogin(username, password);

  if (isValid) {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setIsAuthenticated(true);
  }

  return isValid;
},
[],

);

const logout = useCallback(() => {
sessionStorage.removeItem(STORAGE_KEY);
setIsAuthenticated(false);
}, []);

const value = useMemo(
() => ({
isAuthenticated,
login,
logout,
}),
[isAuthenticated, login, logout],
);

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
}