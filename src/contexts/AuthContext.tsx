import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid student emails from your database
const VALID_EMAILS = [
  'aung.khant.phyo@student.au.edu.mm',
  'hsu.eain.htet@student.au.edu.mm',
  'htoo.yadanar.oo@student.au.edu.mm',
  'chanmyae.au.edu.mm@gmail.com',
  'kaung.pyae.phyo.kyaw@student.au.edu.mm',
  'man.sian.hoih@student.au.edu.mm',
  'phone.pyae.han@student.au.edu.mm',
  'thin.zar.li.htay@student.au.edu.mm',
  'yoon.thiri.naing@student.au.edu.mm',
  'zau.myu.lat@student.au.edu.mm',
  'en.sian.piang@student.au.edu.mm',
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Check if email is in our valid list
    if (!VALID_EMAILS.includes(email)) {
      console.log('❌ Invalid email:', email);
      return false;
    }
    
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    console.log('✅ Logged in:', email);
    return true;
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
