// src/contexts/exam/ExamContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { examService } from '../../services/exam/exam.service';
import { portalService } from '../../services/exam/portal.service';
import type { Exam, ExamResult } from '../../types/exam/exam.types';

interface ExamContextType {
  availableExams: Exam[];
  examResults: ExamResult[];
  loading: boolean;
  error: string | null;
  refreshExams: () => Promise<void>;
  refreshResults: () => Promise<void>;
  getExamById: (id: string) => Exam | undefined;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      refreshExams();
      refreshResults();
    }
  }, [user]);

  const refreshExams = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      // Get student's courses from MAIN Firebase
      const courses = await portalService.getStudentCourses(user.email);
      const courseIds = courses.map(c => c.id);
      
      // Get exams for those courses from EXAM Firebase
      const allExams: Exam[] = [];
      for (const courseId of courseIds) {
        const courseExams = await examService.getCourseExams(courseId);
        // Add course name to each exam
        const course = courses.find(c => c.id === courseId);
        const examsWithCourse = courseExams.map(exam => ({
          ...exam,
          courseName: course?.name || courseId
        }));
        allExams.push(...examsWithCourse);
      }
      
      // Filter only published/active exams
      const activeExams = allExams.filter(exam => 
        exam.status === 'published' || exam.status === 'active'
      );
      
      setAvailableExams(activeExams);
      setError(null);
    } catch (err) {
      setError('Failed to load exams');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshResults = async () => {
    if (!user?.email) return;
    
    try {
      const results = await examService.getStudentResults(user.email);
      setExamResults(results);
    } catch (err) {
      console.error('Failed to load results:', err);
    }
  };

  const getExamById = (id: string) => {
    return availableExams.find(exam => exam.id === id);
  };

  return (
    <ExamContext.Provider value={{
      availableExams,
      examResults,
      loading,
      error,
      refreshExams,
      refreshResults,
      getExamById
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExams = () => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExams must be used within an ExamProvider');
  }
  return context;
};
