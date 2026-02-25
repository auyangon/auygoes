import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for testing (you can change these)
const VALID_USERS = [
  { email: 'student@auy.edu.mm', password: 'student123', name: 'Student User' },
  { email: 'test@auy.edu.mm', password: 'test123', name: 'Test User' },
  { email: 'demo@auy.edu.mm', password: 'demo123', name: 'Demo User' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('auy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = VALID_USERS.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userData = { 
        email: foundUser.email, 
        name: foundUser.name,
        uid: email.replace(/[^a-zA-Z0-9]/g, '') 
      };
      setUser(userData);
      localStorage.setItem('auy_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auy_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}