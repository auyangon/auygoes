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
        
        // Look for a students node or direct student entry
        if (allData.students) {
          for (const [id, student] of Object.entries(allData.students)) {
            const studentData = student as any;
            if (studentData.email === user.email) {
              currentStudent = studentData;
              currentStudentId = id;
              break;
            }
          }
        }
        
        // If not found in students node, look through all nodes
        if (!currentStudent) {
          for (const [key, value] of Object.entries(allData)) {
            if (value && typeof value === 'object' && 'email' in value && value.email === user.email) {
              currentStudent = value;
              currentStudentId = key;
              break;
            }
          }
        }
        
        console.log('👤 Student found:', currentStudent ? 'YES' : 'NO', currentStudent);
        
        // Set student info
        setStudentName(currentStudent?.name || currentStudent?.studentName || user.displayName || 'Student');
        setStudentId(currentStudent?.studentId || currentStudentId || 'AUY-2025-001');
        setMajor(currentStudent?.major || 'Computer Science');
        
        // ===========================================
        // STEP 2: GET ALL COURSES (COURSE CODES ARE TOP-LEVEL KEYS)
        // ===========================================
        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;
        
        // List of possible course codes from your data
        const possibleCourses = ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'];
        
        for (const courseId of possibleCourses) {
          const courseData = allData[courseId];
          
          if (courseData && courseData.courseName) {
            console.log(`📖 Found course ${courseId}:`, courseData);
            
            courseList.push({
              id: courseId,
              courseId: courseId,
              name: courseData.courseName,
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
        
        if (totalCreditsEarned > 0) {
          setGpa(Number((totalGradePoints / totalCreditsEarned).toFixed(2)));
        }
        
        setTotalCredits(totalCreditsEarned);
        setAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0);
        
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