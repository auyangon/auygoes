import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

export interface Course {
  id: string;
  courseId: string;
  name: string;
  teacher: string;
  credits: number;
  grade?: string;
  attendancePercentage?: number;
}

interface DataContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  gpa: number;
  totalCredits: number;
  attendance: number;
  studentName: string;
  studentId: string;
  major: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

// Map emails to student IDs (based on your Firebase structure)
const emailToStudentId: Record<string, string> = {
  'chanmyae.au.edu.mm@gmail.com': 'S001',
  'aung.khant.phyo@student.au.edu.mm': 'S002',
  'hsu.eain.htet@student.au.edu.mm': 'S003',
  'htoo.yadanar.oo@student.au.edu.mm': 'S004',
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('========================================');
        console.log('🔍 DEBUG: Starting data fetch');
        console.log('📧 User email:', user.email);
        console.log('========================================');
        
        // Get student ID from email mapping
        const studentIdFromEmail = emailToStudentId[user.email];
        
        if (!studentIdFromEmail) {
          console.error('❌ No student ID mapping for email:', user.email);
          console.log('📋 Available mappings:', Object.keys(emailToStudentId));
          setError('Student record not found. Please contact administration.');
          setLoading(false);
          return;
        }

        console.log('✅ Found student ID mapping:', studentIdFromEmail);
        
        // Use student ID to fetch data
        const studentRef = ref(db, `students/${studentIdFromEmail}`);
        const snapshot = await get(studentRef);
        
        if (!snapshot.exists()) {
          console.error('❌ No data found for student ID:', studentIdFromEmail);
          setError('Student data not found. Please contact administration.');
          setLoading(false);
          return;
        }

        const studentData = snapshot.val();
        console.log('✅ Student found:', studentData);
        
        setStudentName(studentData.studentName || studentData.name || '');
        setStudentId(studentIdFromEmail);
        setMajor(studentData.major || studentData.program || '');

        // Get courses
        const coursesData = studentData.courses || studentData.enrollments || {};
        const courseList: Course[] = [];

        for (const [courseId, courseInfo] of Object.entries(coursesData)) {
          const data = courseInfo as any;
          courseList.push({
            id: courseId,
            courseId: courseId,
            name: data.courseName || data.name || courseId,
            teacher: data.teacherName || data.teacher || '',
            credits: data.credits || 3,
            grade: data.grade || '',
            attendancePercentage: data.attendancePercentage || 0
          });
        }

        setCourses(courseList);
        console.log(`📚 Loaded ${courseList.length} courses`);

        // Calculate GPA
        let totalPoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;

        courseList.forEach((course) => {
          if (course.grade && gradePoints[course.grade] !== undefined) {
            totalPoints += gradePoints[course.grade] * course.credits;
            totalCreditsEarned += course.credits;
          }
          if (course.attendancePercentage) {
            totalAttendance += course.attendancePercentage;
          }
        });

        setGpa(totalCreditsEarned > 0 ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
        setTotalCredits(totalCreditsEarned);
        setAttendance(courseList.length ? Math.round(totalAttendance / courseList.length) : 0);
        
      } catch (err) {
        console.error('❌ Error:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DataContext.Provider value={{
      courses, loading, error, gpa, totalCredits, attendance, studentName, studentId, major
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
