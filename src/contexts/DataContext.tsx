import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Course {
  id: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  credits: number;
  grade: string;
  attendancePercentage: number;
  googleClassroomLink?: string;
}

export interface Student {
  studentId: string;
  studentName: string;
  email: string;
  studyMode: string;
  major: string;
}

interface DataContextType {
  courses: Course[];
  student: Student | null;
  gpa: number;
  totalCredits: number;
  averageAttendance: number;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const GRADE_POINTS: Record<string, number> = {
  'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0,
  'F': 0.0
};

function encodeEmail(email: string): string {
  return email.replace(/\./g, ',,,').replace(/@/g, ',,@,,');
}

// Type for the raw course data from Firebase
interface RawCourse {
  courseName: string;
  teacherName: string;
  credits: number;
  grade: string;
  attendancePercentage: number;
  googleClassroomLink?: string;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudentData() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const encoded = encodeEmail(user.email);
        const studentRef = ref(db, `students/${encoded}`);
        const snapshot = await get(studentRef);

        if (!snapshot.exists()) {
          setError('Student record not found');
          setLoading(false);
          return;
        }

        const data = snapshot.val();

        setStudent({
          studentId: data.studentId,
          studentName: data.studentName,
          email: data.email,
          studyMode: data.studyMode,
          major: data.major,
        });

        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;

        if (data.courses) {
          Object.entries(data.courses).forEach(([id, rawCourse]) => {
            const course = rawCourse as RawCourse;
            courseList.push({
              id,
              courseId: id,
              courseName: course.courseName,
              teacherName: course.teacherName,
              credits: course.credits,
              grade: course.grade,
              attendancePercentage: course.attendancePercentage,
              googleClassroomLink: course.googleClassroomLink,
            });

            const points = GRADE_POINTS[course.grade] || 0;
            totalGradePoints += points * course.credits;
            totalCreditsEarned += course.credits;

            if (course.attendancePercentage) {
              totalAttendance += course.attendancePercentage;
              attendanceCount++;
            }
          });
        }

        setCourses(courseList);
        setGpa(totalCreditsEarned > 0 ? totalGradePoints / totalCreditsEarned : 0);
        setTotalCredits(totalCreditsEarned);
        setAverageAttendance(attendanceCount > 0 ? totalAttendance / attendanceCount : 0);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchStudentData();
  }, [user]);

  return (
    <DataContext.Provider value={{ courses, student, gpa, totalCredits, averageAttendance, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}