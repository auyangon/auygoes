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

// This must match the encoding used in the upload script
function encodeEmail(email: string): string {
  return email.replace(/\./g, ',,,').replace(/@/g, ',,@,,');
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
        const encodedEmail = encodeEmail(user.email);
        const studentRef = ref(db, `students/${encodedEmail}`);
        const snapshot = await get(studentRef);

        if (!snapshot.exists()) {
          setError('Student record not found');
          setLoading(false);
          return;
        }

        const studentData = snapshot.val();

        setStudent({
          studentId: studentData.studentId,
          studentName: studentData.studentName,
          email: studentData.email,
          studyMode: studentData.studyMode,
          major: studentData.major,
        });

        const coursesList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;

        if (studentData.courses) {
          Object.entries(studentData.courses).forEach(([courseId, course]: any) => {
            const credits = Number(course.credits) || 0;
            const grade = course.grade || '';
            const attendance = Number(course.attendancePercentage) || 0;

            coursesList.push({
              id: courseId,
              courseId: courseId,
              courseName: course.courseName,
              teacherName: course.teacherName,
              credits: credits,
              grade: grade,
              attendancePercentage: attendance,
              googleClassroomLink: course.googleClassroomLink,
            });

            if (grade && GRADE_POINTS[grade]) {
              totalGradePoints += GRADE_POINTS[grade] * credits;
              totalCreditsEarned += credits;
            }

            if (attendance > 0) {
              totalAttendance += attendance;
              attendanceCount++;
            }
          });
        }

        setCourses(coursesList);
        setGpa(totalCreditsEarned > 0 ? totalGradePoints / totalCreditsEarned : 0);
        setTotalCredits(totalCreditsEarned);
        setAverageAttendance(attendanceCount > 0 ? totalAttendance / attendanceCount : 0);
      } catch (err) {
        console.error('Error fetching data:', err);
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

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}