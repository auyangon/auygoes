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

// Email to student ID mapping
const EMAIL_TO_ID: Record<string, string> = {
  'aung.khant.phyo@student.au.edu.mm': 'S001',
  'hsu.eain.htet@student.au.edu.mm': 'S002',
  'htoo.yadanar.oo@student.au.edu.mm': 'S003',
  'chanmyae.au.edu.mm@gmail.com': 'S004',
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
        console.log('🔍 Fetching data for:', user.email);
        
        // Get student ID from email
        const studentIdFromEmail = EMAIL_TO_ID[user.email];
        
        if (!studentIdFromEmail) {
          setError('Student record not found');
          setLoading(false);
          return;
        }

        setStudentId(studentIdFromEmail);
        
        // Get student data
        const studentRef = ref(db, `students/${studentIdFromEmail}`);
        const studentSnap = await get(studentRef);
        
        if (studentSnap.exists()) {
          const studentData = studentSnap.val();
          setStudentName(studentData.studentName || '');
          setMajor(studentData.major || 'ISP');
        }

        // Get enrollments for this student
        const enrollmentsRef = ref(db, 'enrollments');
        const enrollmentsSnap = await get(enrollmentsRef);
        
        const courseList: Course[] = [];
        
        if (enrollmentsSnap.exists()) {
          const allEnrollments = enrollmentsSnap.val();
          
          Object.values(allEnrollments).forEach((enroll: any) => {
            if (enroll.studentId === studentIdFromEmail) {
              courseList.push({
                id: enroll.courseId,
                courseId: enroll.courseId,
                name: enroll.courseName || enroll.courseId,
                teacher: enroll.teacherName || '',
                credits: enroll.credits || 3,
                grade: enroll.grade || '',
                attendancePercentage: enroll.attendancePercentage || 0
              });
            }
          });
        }

        setCourses(courseList);

        // Calculate GPA
        let totalPoints = 0;
        let totalCredits = 0;
        let totalAttendance = 0;

        courseList.forEach((course) => {
          if (course.grade && gradePoints[course.grade]) {
            totalPoints += gradePoints[course.grade] * course.credits;
            totalCredits += course.credits;
          }
          totalAttendance += course.attendancePercentage || 0;
        });

        setGpa(totalCredits ? Number((totalPoints / totalCredits).toFixed(2)) : 0);
        setTotalCredits(totalCredits);
        setAttendance(courseList.length ? Math.round(totalAttendance / courseList.length) : 0);
        
      } catch (err) {
        setError('Failed to load data');
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
