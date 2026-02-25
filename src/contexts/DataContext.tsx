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
        
        // Get all data from Firebase root
        const rootRef = ref(db, '/');
        const snapshot = await get(rootRef);
        const allData = snapshot.val() || {};
        
        console.log('📚 All Firebase data:', allData);
        
        // ===========================================
        // STEP 1: FIND STUDENT BY EMAIL
        // ===========================================
        let currentStudent: any = null;
        let currentStudentId = '';
        
        // Look through all nodes for student with matching email
        for (const [key, value] of Object.entries(allData)) {
          if (value && typeof value === 'object') {
            // Check if this entry has an email field that matches
            if ('email' in value && value.email === user.email) {
              currentStudent = value;
              currentStudentId = key;
              break;
            }
          }
        }
        
        console.log('👤 Student found:', currentStudent ? 'YES' : 'NO', currentStudent);
        
        // Set student info (use displayName from auth if no student record)
        setStudentName(currentStudent?.name || currentStudent?.studentName || user.displayName || 'Student');
        setStudentId(currentStudent?.studentId || currentStudentId || 'AUY-2025-001');
        setMajor(currentStudent?.major || 'Computer Science');
        
        // ===========================================
        // STEP 2: GET ALL COURSES
        // Each course is a top-level node with courseName field
        // ===========================================
        const allCourses: Record<string, any> = {};
        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;
        
        // Loop through all top-level nodes to find courses
        for (const [key, value] of Object.entries(allData)) {
          // Check if this node looks like a course (has courseName field)
          if (value && typeof value === 'object' && 'courseName' in value) {
            console.log(`📖 Found course: ${key}`, value);
            
            const courseData = value as any;
            
            // Check if this course belongs to the student
            // For now, include all courses (you can filter by student's enrolledCourses later)
            courseList.push({
              id: key,
              courseId: key,
              name: courseData.courseName || key,
              teacherName: courseData.teacherName || '',
              credits: courseData.credits || 3,
              schedule: courseData.schedule || '',
              room: courseData.room || '',
              googleClassroomLink: courseData.googleClassroomLink || '',
              grade: courseData.grade || '',
              attendancePercentage: courseData.attendancePercentage
            });
            
            // Calculate GPA
            if (courseData.grade) {
              const points = gradePoints[courseData.grade] || 0;
              totalGradePoints += points * (courseData.credits || 3);
              totalCreditsEarned += (courseData.credits || 3);
            }
            
            // Calculate attendance
            if (courseData.attendancePercentage) {
              totalAttendance += courseData.attendancePercentage;
              attendanceCount++;
            }
          }
        }
        
        console.log('✅ Courses found:', courseList);
        
        setCourses(courseList);
        
        // Calculate overall GPA
        if (totalCreditsEarned > 0) {
          setGpa(Number((totalGradePoints / totalCreditsEarned).toFixed(2)));
        }
        
        setTotalCredits(totalCreditsEarned);
        setAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0);
        
      } catch (err: any) {
        console.error('❌ Error fetching data:', err);
        setError(err.message || 'Failed to load data');
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