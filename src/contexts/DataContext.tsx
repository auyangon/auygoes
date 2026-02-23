import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
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
        console.log('Fetching data for email:', user.email);
        
        const enrollmentsRef = ref(db, 'enrollments');
        const enrollmentsQuery = query(
          enrollmentsRef,
          orderByChild('email'),
          equalTo(user.email)
        );
        
        const snapshot = await get(enrollmentsQuery);
        
        if (!snapshot.exists()) {
          setError('No enrollment data found');
          setLoading(false);
          return;
        }

        const enrollments = snapshot.val();
        const userEnrollments: any[] = Object.values(enrollments);
        let studentInfo: any = null;

        // Capture student info from first enrollment
        if (userEnrollments.length > 0) {
          studentInfo = {
            studentId: userEnrollments[0].studentId,
            studentName: userEnrollments[0].studentName,
            studyMode: userEnrollments[0].studyMode,
            major: userEnrollments[0].major,
          };
        }

        setStudent({
          studentId: studentInfo.studentId,
          studentName: studentInfo.studentName,
          email: user.email,
          studyMode: studentInfo.studyMode,
          major: studentInfo.major,
        });

        const coursesList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;

        userEnrollments.forEach((enrollment: any) => {
          const credits = Number(enrollment.credits) || 0;
          const grade = enrollment.grade || '';
          const attendance = Number(enrollment.attendancePercentage) || 0;
          
          coursesList.push({
            id: enrollment.courseId,
            courseId: enrollment.courseId,
            courseName: enrollment.courseName,
            teacherName: enrollment.teacherName,
            credits: credits,
            grade: grade,
            attendancePercentage: attendance,
            googleClassroomLink: enrollment.googleClassroomLink,
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
    <DataContext.Provider value={{ 
      courses, 
      student,
      gpa, 
      totalCredits, 
      averageAttendance,
      loading, 
      error
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