import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AuthUser = {
  id: number;
  name?: string;
  username?: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('lgpd_token') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('lgpd_user');

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login: (newToken, newUser) => {
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('lgpd_token', newToken);
      localStorage.setItem('lgpd_user', JSON.stringify(newUser));
      localStorage.removeItem('token');
    },
    logout: () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('lgpd_token');
      localStorage.removeItem('lgpd_user');
      localStorage.removeItem('token');
    },
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
