import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Valid emails from our Firebase
    const validEmails = [
      'aung.khant.phyo@student.au.edu.mm',
      'hsu.eain.htet@student.au.edu.mm',
      'htoo.yadanar.oo@student.au.edu.mm',
      'chanmyae.au.edu.mm@gmail.com'
    ];
    
    if (!validEmails.includes(email)) {
      return false;
    }
    
    const user = { email };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
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
