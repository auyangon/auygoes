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
        console.log('🔍 Fetching data for email:', user.email);
        
        const emailKey = sanitizeEmail(user.email);
        console.log('📧 Sanitized email key:', emailKey);

        // Fetch the student node directly
        const studentRef = ref(db, `students/${emailKey}`);
        const snapshot = await get(studentRef);
        const studentData = snapshot.val();

        console.log('📊 Student data from Firebase:', studentData);

        if (!studentData) {
          console.error('❌ No student found with email:', user.email);
          setError(`No student found with email: ${user.email}`);
          setLoading(false);
          return;
        }

        // Set student info - CRITICAL for welcome message
        setStudentName(studentData.name || studentData.studentName || user.displayName || 'Student');
        setStudentId(studentData.studentId || '');
        setMajor(studentData.major || 'ISP Program');

        // Get courses from the student data
        const coursesData = studentData.courses || {};
        console.log('📚 Courses data:', coursesData);

        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;

        // Loop through each course
        for (const [courseId, courseInfo] of Object.entries(coursesData)) {
          const course = courseInfo as any;
          console.log(`📖 Processing course ${courseId}:`, course);

          if (course.courseName) {
            courseList.push({
              id: courseId,
              courseId: courseId,
              name: course.courseName || courseId,
              teacher: course.teacherName || '',
              credits: course.credits || 3,
              googleClassroomLink: course.googleClassroomLink || '',
              grade: course.grade || '',
              attendancePercentage: course.attendancePercentage || 0,
            });

            if (course.grade) {
              const points = gradePoints[course.grade] || 0;
              totalGradePoints += points * (course.credits || 3);
              totalCreditsEarned += (course.credits || 3);
            }

            if (course.attendancePercentage) {
              totalAttendance += course.attendancePercentage;
              attendanceCount++;
            }
          }
        }

        console.log('✅ Final course list:', courseList);
        setCourses(courseList);
        
        if (totalCreditsEarned > 0) {
          const calculatedGpa = totalGradePoints / totalCreditsEarned;
          setGpa(Number(calculatedGpa.toFixed(2)));
        }
        
        setTotalCredits(totalCreditsEarned);
        
        if (attendanceCount > 0) {
          const avgAttendance = totalAttendance / attendanceCount;
          setAttendance(Math.round(avgAttendance));
        }

      } catch (err: any) {
        console.error('❌ Error fetching data:', err);
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
      announcements: [],
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
