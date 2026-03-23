import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Course,
  Schedule,
  Material,
  Quest,
  StudentQuest,
  AppState
} from '../types';
import {
  fetchStudentByEmail,
  fetchCourses,
  fetchEnrollmentsByEmail,
  fetchSchedules,
  fetchMaterials,
  fetchAnnouncements,
  fetchAttendanceByEmail,
  fetchQuests,
  fetchStudentQuestsByEmail,
  fetchRequestsByEmail,
  REFRESH_INTERVAL,
} from '../services/api';

interface StudentContextType extends AppState {
  refreshData: () => Promise<void>;
  loginWithGoogle: (email: string) => Promise<boolean>;
  logout: () => void;
  getEnrolledCourses: () => Course[];
  getStudentSchedules: () => Schedule[];
  getCourseMaterials: (courseCode: string) => Material[];
  getCourseByCode: (courseCode: string) => Course | undefined;
  getQuestWithStudentData: (questId: string) => { quest: Quest; studentQuest: StudentQuest | undefined } | undefined;
}

const StudentContext = createContext<StudentContextType | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state, setState] = useState<AppState>({
    currentStudent: null,
    enrollments: [],
    courses: [],
    schedules: [],
    materials: [],
    announcements: [],
    attendance: [],
    quests: [],
    studentQuests: [],
    requests: [],
    isLoading: true,
    error: null,
  });

  // Google Login function
  const loginWithGoogle = async (email: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const student = await fetchStudentByEmail(email);
      if (!student) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      setStudentEmail(email);
      setIsAuthenticated(true);
      
      await fetchAllData(email);
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Login failed' }));
      return false;
    }
  };

  const logout = () => {
    setStudentEmail(null);
    setIsAuthenticated(false);
    setState({
      currentStudent: null,
      enrollments: [],
      courses: [],
      schedules: [],
      materials: [],
      announcements: [],
      attendance: [],
      quests: [],
      studentQuests: [],
      requests: [],
      isLoading: false,
      error: null,
    });
  };

  const fetchAllData = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const [
        student,
        courses,
        enrollments,
        schedules,
        materials,
        announcements,
        attendance,
        quests,
        studentQuests,
        requests,
      ] = await Promise.all([
        fetchStudentByEmail(email),
        fetchCourses(),
        fetchEnrollmentsByEmail(email),
        fetchSchedules(),
        fetchMaterials(),
        fetchAnnouncements(),
        fetchAttendanceByEmail(email),
        fetchQuests(),
        fetchStudentQuestsByEmail(email),
        fetchRequestsByEmail(email),
      ]);

      setState({
        currentStudent: student,
        courses,
        enrollments,
        schedules,
        materials,
        announcements,
        attendance,
        quests,
        studentQuests,
        requests,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      }));
    }
  }, []);

  useEffect(() => {
    if (studentEmail && isAuthenticated) {
      fetchAllData(studentEmail);
    }
  }, [studentEmail, isAuthenticated, fetchAllData]);

  useEffect(() => {
    if (!studentEmail || !isAuthenticated) return;
    
    const interval = setInterval(() => fetchAllData(studentEmail), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [studentEmail, isAuthenticated, fetchAllData]);

  const getEnrolledCourses = useCallback((): Course[] => {
    const enrolledCourseCodes = state.enrollments.map(e => e.courseCode);
    return state.courses.filter(c => enrolledCourseCodes.includes(c.courseCode));
  }, [state.enrollments, state.courses]);

  const getStudentSchedules = useCallback((): Schedule[] => {
    const enrolledCourseCodes = state.enrollments.map(e => e.courseCode);
    return state.schedules.filter(s => enrolledCourseCodes.includes(s.courseCode));
  }, [state.enrollments, state.schedules]);

  const getCourseMaterials = useCallback((courseCode: string): Material[] => {
    return state.materials.filter(m => m.courseCode === courseCode);
  }, [state.materials]);

  const getCourseByCode = useCallback((courseCode: string): Course | undefined => {
    return state.courses.find(c => c.courseCode === courseCode);
  }, [state.courses]);

  const getQuestWithStudentData = useCallback((questId: string) => {
    const quest = state.quests.find(q => q.questId === questId);
    if (!quest) return undefined;
    const studentQuest = state.studentQuests.find(sq => sq.questId === questId);
    return { quest, studentQuest };
  }, [state.quests, state.studentQuests]);

  const value: StudentContextType = {
    ...state,
    loginWithGoogle,
    logout,
    refreshData: () => studentEmail ? fetchAllData(studentEmail) : Promise.resolve(),
    getEnrolledCourses,
    getStudentSchedules,
    getCourseMaterials,
    getCourseByCode,
    getQuestWithStudentData,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
