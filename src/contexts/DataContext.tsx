import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
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

  useEffect(() => {
    async function fetchStudentData() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Looking up student with email:', user.email);
        
        // Get all students data from Firebase
        const studentsRef = ref(db, 'students');
        const snapshot = await get(studentsRef);
        const studentsData = snapshot.val() || {};
        
        console.log('📚 All students data:', studentsData);
        
        // Clean the email to match Firebase keys (remove dots, etc.)
        // Firebase keys have commas instead of dots
        const cleanEmail = user.email.replace(/\./g, ',,,');
        console.log('🔑 Looking for student key:', cleanEmail);
        
        // Try to find the student by email (exact match or partial)
        let currentStudent: any = null;
        let currentStudentKey = '';
        
        // Method 1: Direct key match with cleaned email
        if (studentsData[cleanEmail]) {
          currentStudent = studentsData[cleanEmail];
          currentStudentKey = cleanEmail;
          console.log('✅ Found student by cleaned email key');
        } else {
          // Method 2: Search through all students
          for (const [key, student] of Object.entries(studentsData)) {
            const studentData = student as any;
            if (studentData.email === user.email) {
              currentStudent = studentData;
              currentStudentKey = key;
              console.log('✅ Found student by email field match');
              break;
            }
          }
        }
        
        console.log('👤 Student found:', currentStudent ? 'YES' : 'NO', currentStudent);
        
        if (!currentStudent) {
          setError(`No student found with email: ${user.email}`);
          setLoading(false);
          return;
        }
        
        // Set student info
        setStudentName(currentStudent.studentName || user.displayName || 'Student');
        setStudentId(currentStudent.studentId || 'AUY-2025-001');
        setMajor(currentStudent.major || 'ISP program');
        
        // Get courses from the student's courses object
        const studentCourses = currentStudent.courses || {};
        console.log('📖 Student courses:', studentCourses);
        
        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;
        
        // Loop through each course in the student's courses
        for (const [courseId, courseData] of Object.entries(studentCourses)) {
          const data = courseData as any;
          console.log(`📚 Processing course ${courseId}:`, data);
          
          courseList.push({
            id: courseId,
            courseId: courseId,
            name: data.courseName || courseId,
            teacherName: data.teacherName || '',
            credits: data.credits || 3,
            schedule: data.schedule || '',
            room: data.room || '',
            googleClassroomLink: data.googleClassroomLink || '',
            grade: data.grade || '',
            attendancePercentage: data.attendancePercentage
          });
          
          // Calculate GPA
          if (data.grade) {
            const points = gradePoints[data.grade] || 0;
            totalGradePoints += points * (data.credits || 3);
            totalCreditsEarned += (data.credits || 3);
          }
          
          // Calculate attendance
          if (data.attendancePercentage) {
            totalAttendance += data.attendancePercentage;
            attendanceCount++;
          }
        }
        
        console.log('✅ Final course list:', courseList);
        
        setCourses(courseList);
        
        if (totalCreditsEarned > 0) {
          setGpa(Number((totalGradePoints / totalCreditsEarned).toFixed(2)));
        }
        
        setTotalCredits(totalCreditsEarned);
        setAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0);
        
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