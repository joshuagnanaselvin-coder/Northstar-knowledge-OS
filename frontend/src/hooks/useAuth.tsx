import { useState, createContext, useContext, ReactNode } from 'react';
import type { User, KPIs } from '../types';
import { api } from '../api';

interface AuthContextType {
  user: User | null;
  login: (name: string, role: string) => Promise<void>;
  logout: () => void;
  kpis: KPIs | null;
  setKpis: (k: KPIs | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  kpis: null,
  setKpis: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('northstar_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [kpis, setKpis] = useState<KPIs | null>(() => {
    const saved = localStorage.getItem('northstar_kpis');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (name: string, role: string) => {
    const res = await fetch(api('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setUser(data);
    localStorage.setItem('northstar_user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setKpis(null);
    localStorage.removeItem('northstar_user');
    localStorage.removeItem('northstar_kpis');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, kpis, setKpis }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
