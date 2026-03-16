import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { api } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  major: string;
  year: number;
  avatar: string;
  gpa: number;
  credits: number;
  totalCredits: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage<User | null>('auy_user', null);
  const [isLoading, setIsLoading] = useState(false);

  const user = storedUser;
  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const authUser = await api.authenticateUser(email, password);
    if (!authUser) {
      setIsLoading(false);
      return false;
    }
    const student = await api.getStudentByEmail(email);
    if (!student) {
      setIsLoading(false);
      return false;
    }
    // Map to User interface
    const mappedUser: User = {
      id: student.studentId,
      name: student.studentName,
      email: student.email,
      studentId: student.studentId,
      major: student.major,
      year: 1, // you can compute from enrollment date if available
      avatar: student.studentName.split(' ').map(n => n[0]).join('').slice(0,2),
      gpa: 0, // will be computed from enrollments later
      credits: 0,
      totalCredits: 120,
    };
    setStoredUser(mappedUser);
    setIsLoading(false);
    return true;
  }, [setStoredUser]);

  const logout = useCallback(() => {
    removeStoredUser();
  }, [removeStoredUser]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
