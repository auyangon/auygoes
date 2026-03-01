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
  studentEmail: string;
  major: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

const encodeEmailForFirebase = (email: string): string => {
  return email.replace(/\./g, ',');
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
  const [studentEmail, setStudentEmail] = useState('');
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
        const email = user.email;
        setStudentEmail(email);
        
        const encodedEmail = encodeEmailForFirebase(email);
        
        console.log('========================================');
        console.log('🔍 Fetching data for email:', email);
        console.log('📁 Path:', `students/${encodedEmail}`);
        console.log('========================================');
        
        const studentRef = ref(db, `students/${encodedEmail}`);
        const studentSnap = await get(studentRef);

        if (!studentSnap.exists()) {
          console.error('❌ No student found for email:', email);
          setError('Student record not found');
          setLoading(false);
          return;
        }

        const studentData = studentSnap.val();
        console.log('✅ Student found:', studentData);
        
        setStudentName(studentData.studentName || '');
        setMajor(studentData.major || 'ISP');

        const coursesData = studentData.courses || {};
        const courseList: Course[] = [];

        for (const [courseId, courseInfo] of Object.entries(coursesData)) {
          const data = courseInfo as any;
          courseList.push({
            id: courseId,
            courseId: courseId,
            name: data.courseName || courseId,
            teacher: data.teacherName || '',
            credits: data.credits || 3,
            grade: data.grade || '',
            attendancePercentage: data.attendancePercentage || 0
          });
        }

        setCourses(courseList);

        let totalPoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;

        courseList.forEach((course) => {
          if (course.grade && gradePoints[course.grade]) {
            totalPoints += gradePoints[course.grade] * course.credits;
            totalCreditsEarned += course.credits;
          }
          totalAttendance += course.attendancePercentage || 0;
        });

        setGpa(totalCreditsEarned ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
        setTotalCredits(totalCreditsEarned);
        setAttendance(courseList.length ? Math.round(totalAttendance / courseList.length) : 0);
        
      } catch (err) {
        console.error('❌ Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DataContext.Provider value={{
      courses, loading, error, gpa, totalCredits, attendance, attendanceRecords, studentName, studentEmail, major
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

