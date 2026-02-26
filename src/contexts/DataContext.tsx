import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { sanitizeEmail } from '../utils/sanitizeEmail';

export interface Course {
  id: string;
  courseId: string;
  name: string;
  teacher: string;
  credits: number;
  googleClassroomLink?: string;
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
  announcements: any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
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
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function fetchStudentData() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const emailKey = sanitizeEmail(user.email);
        console.log('🔍 Looking up student with key:', emailKey);

        // ✅ FIXED LINE 63 – using backticks and template literal correctly
        const studentRef = ref(db, `students/${emailKey}`);
        const snapshot = await get(studentRef);
        const studentData = snapshot.val();

        if (!studentData) {
          setError(`No student found with email: ${user.email}`);
          setLoading(false);
          return;
        }

        setStudentName(studentData.name || user.displayName || 'Student');
        setStudentId(studentData.studentId || '');
        setMajor(studentData.major || 'ISP program');

        const enrollments = studentData.enrollments || {};
        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;

        for (const [courseId, enrollment] of Object.entries(enrollments)) {
          const e = enrollment as any;
          const course = e.courseData || {};

          courseList.push({
            id: courseId,
            courseId,
            name: course.name || courseId,
            teacher: course.teacher || '',
            credits: course.credits || 3,
            googleClassroomLink: course.googleClassroomLink || '',
            grade: e.grade || '',
            attendancePercentage: e.attendancePercentage,
          });

          if (e.grade) {
            const points = gradePoints[e.grade] || 0;
            totalGradePoints += points * (course.credits || 3);
            totalCreditsEarned += (course.credits || 3);
          }

          if (e.attendancePercentage) {
            totalAttendance += e.attendancePercentage;
            attendanceCount++;
          }
        }

        setCourses(courseList);
        setGpa(totalCreditsEarned > 0 ? Number((totalGradePoints / totalCreditsEarned).toFixed(2)) : 0);
        setTotalCredits(totalCreditsEarned);
        setAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0);

        const annRef = ref(db, 'announcements');
        const annSnap = await get(annRef);
        if (annSnap.exists()) {
          const annData = annSnap.val();
          setAnnouncements(Object.values(annData));
        }

      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudentData();
  }, [user]);

  return (
    <DataContext.Provider value={{
      courses,
      loading,
      error,
      gpa,
      totalCredits,
      attendance,
      studentName,
      studentId,
      major,
      announcements,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}