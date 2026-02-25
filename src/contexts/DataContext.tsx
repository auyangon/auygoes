import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, get, child } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface Course {
  id: string;
  courseId: string;
  name: string;
  teacherName: string;
  credits: number;
  schedule?: string;
  room?: string;
  googleClassroomLink?: string;
  grade?: string;
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

  useEffect(() => {
    async function fetchStudentData() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const dbRef = ref(db);
        
        const studentsSnapshot = await get(child(dbRef, 'students'));
        const students = studentsSnapshot.val() || {};
        
        let currentStudent: any = null;
        let currentStudentId = '';
        
        for (const [id, student] of Object.entries(students)) {
          if ((student as any).email === user.email) {
            currentStudent = student;
            currentStudentId = id;
            break;
          }
        }
        
        if (!currentStudent) {
          setStudentName(user.displayName || 'Student');
          setStudentId('AUY' + Math.floor(1000 + Math.random() * 9000));
          setMajor('Computer Science');
          
          const mockCourses: Course[] = [
            {
              id: 'CS101',
              courseId: 'CS101',
              name: 'Introduction to Computer Science',
              teacherName: 'Dr. Smith',
              credits: 3,
              schedule: 'Mon/Wed 10:00-11:30',
              room: 'Room 201',
              googleClassroomLink: 'https://classroom.google.com/c/CS101',
              grade: 'A-'
            },
            {
              id: 'ENG101',
              courseId: 'ENG101',
              name: 'English Composition',
              teacherName: 'Dr. Brown',
              credits: 3,
              schedule: 'Tue/Thu 09:00-10:30',
              room: 'Humanities 205',
              googleClassroomLink: 'https://classroom.google.com/c/ENG101',
              grade: 'B+'
            },
            {
              id: 'MATH101',
              courseId: 'MATH101',
              name: 'College Mathematics',
              teacherName: 'Prof. Lee',
              credits: 4,
              schedule: 'Mon/Wed/Fri 11:00-12:00',
              room: 'Science 210',
              googleClassroomLink: 'https://classroom.google.com/c/MATH101',
              grade: 'B'
            }
          ];
          
          setCourses(mockCourses);
          setGpa(3.4);
          setTotalCredits(10);
          setAttendance(92);
          setLoading(false);
          return;
        }
        
        setStudentName(currentStudent.studentName || user.displayName || '');
        setStudentId(currentStudent.studentId || currentStudentId);
        setMajor(currentStudent.major || 'Computer Science');
        
        const coursesSnapshot = await get(child(dbRef, 'courses'));
        const coursesData = coursesSnapshot.val() || {};
        
        const gradesSnapshot = await get(child(dbRef, 'studentCourses'));
        const gradesData = gradesSnapshot.val() || {};
        
        const studentGrades: any[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;
        
        for (const [key, data] of Object.entries(gradesData)) {
          if ((data as any).studentId === currentStudentId) {
            studentGrades.push(data);
            const points = gradePoints[(data as any).grade] || 0;
            totalGradePoints += points * (data as any).credits;
            totalCreditsEarned += (data as any).credits;
          }
        }
        
        for (const [key, data] of Object.entries(gradesData)) {
          if ((data as any).studentId === currentStudentId && (data as any).attendancePercentage) {
            totalAttendance += (data as any).attendancePercentage || 0;
            attendanceCount++;
          }
        }
        
        const enrolledCourses: Course[] = [];
        
        for (const [id, course] of Object.entries(coursesData)) {
          const courseData = course as any;
          const grade = studentGrades.find(g => g.courseId === id);
          
          enrolledCourses.push({
            id: id,
            courseId: id,
            name: courseData.courseName || id,
            teacherName: courseData.teacherName || '',
            credits: courseData.credits || 0,
            schedule: courseData.schedule || '',
            room: courseData.room || '',
            googleClassroomLink: courseData.googleClassroomLink || https://classroom.google.com/c/,
            grade: grade?.grade || ''
          });
        }
        
        setCourses(enrolledCourses);
        setGpa(totalCreditsEarned > 0 ? Number((totalGradePoints / totalCreditsEarned).toFixed(2)) : 0);
        setTotalCredits(totalCreditsEarned);
        setAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 85);
        
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load data');
        
        setStudentName(user.displayName || 'Student');
        setStudentId('AUY' + Math.floor(1000 + Math.random() * 9000));
        setMajor('Computer Science');
        
        const mockCourses: Course[] = [
          {
            id: 'CS101',
            courseId: 'CS101',
            name: 'Introduction to Computer Science',
            teacherName: 'Dr. Smith',
            credits: 3,
            schedule: 'Mon/Wed 10:00-11:30',
            room: 'Room 201',
            googleClassroomLink: 'https://classroom.google.com/c/CS101',
            grade: 'A-'
          },
          {
            id: 'ENG101',
            courseId: 'ENG101',
            name: 'English Composition',
            teacherName: 'Dr. Brown',
            credits: 3,
            schedule: 'Tue/Thu 09:00-10:30',
            room: 'Humanities 205',
            googleClassroomLink: 'https://classroom.google.com/c/ENG101',
            grade: 'B+'
          },
          {
            id: 'MATH101',
            courseId: 'MATH101',
            name: 'College Mathematics',
            teacherName: 'Prof. Lee',
            credits: 4,
            schedule: 'Mon/Wed/Fri 11:00-12:00',
            room: 'Science 210',
            googleClassroomLink: 'https://classroom.google.com/c/MATH101',
            grade: 'B'
          }
        ];
        
        setCourses(mockCourses);
        setGpa(3.4);
        setTotalCredits(10);
        setAttendance(92);
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
      announcements: [] 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
