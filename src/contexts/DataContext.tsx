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
        
        // Check if there's a 'students' node
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
        
        // If no students node, try to find by email in root
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
        if (currentStudent) {
          setStudentName(currentStudent.name || currentStudent.studentName || user.displayName || 'Student');
          setStudentId(currentStudent.studentId || currentStudentId || 'AUY-2025-001');
          setMajor(currentStudent.major || 'Computer Science');
        } else {
          setStudentName(user.displayName?.split(' ')[0] || 'Student');
          setStudentId('AUY-2025-001');
          setMajor('Computer Science');
        }
        
        // ===========================================
        // STEP 2: GET ALL COURSES FROM FIREBASE
        // ===========================================
        const allCourses: Record<string, any> = {};
        
        if (allData.courses) {
          Object.assign(allCourses, allData.courses);
        } else {
          const coursePattern = /^[A-Z]{3,4}\d{0,3}$/;
          for (const [key, value] of Object.entries(allData)) {
            if (value && typeof value === 'object' && 'courseName' in value) {
              allCourses[key] = value;
            } else if (value && typeof value === 'object' && coursePattern.test(key)) {
              allCourses[key] = value;
            }
          }
        }
        
        console.log('📖 All available courses:', allCourses);
        
        // ===========================================
        // STEP 3: DETERMINE WHICH COURSES THIS STUDENT IS ENROLLED IN
        // ===========================================
        const enrolledCourseIds = new Set<string>();
        
        if (currentStudent?.enrolledCourses && Array.isArray(currentStudent.enrolledCourses)) {
          currentStudent.enrolledCourses.forEach((courseId: string) => {
            enrolledCourseIds.add(courseId);
          });
        }
        
        if (allData.studentCourses) {
          for (const [key, record] of Object.entries(allData.studentCourses)) {
            const gradeRecord = record as any;
            if (gradeRecord.studentId === currentStudentId || 
                gradeRecord.studentId === currentStudent?.studentId ||
                gradeRecord.email === user.email) {
              if (gradeRecord.courseId) {
                enrolledCourseIds.add(gradeRecord.courseId);
              }
            }
          }
        }
        
        console.log('🎯 Student enrolled in courses:', Array.from(enrolledCourseIds));
        
        // ===========================================
        // STEP 4: BUILD STUDENT'S COURSES WITH GRADES
        // ===========================================
        const studentCourses: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;
        
        const gradeMap = new Map();
        if (allData.studentCourses) {
          for (const [key, record] of Object.entries(allData.studentCourses)) {
            const gradeRecord = record as any;
            if (gradeRecord.studentId === currentStudentId || 
                gradeRecord.studentId === currentStudent?.studentId ||
                gradeRecord.email === user.email) {
              if (gradeRecord.courseId) {
                gradeMap.set(gradeRecord.courseId, {
                  grade: gradeRecord.grade,
                  attendance: gradeRecord.attendancePercentage
                });
              }
            }
          }
        }
        
        for (const courseId of enrolledCourseIds) {
          const courseData = allCourses[courseId] || {};
          const gradeInfo = gradeMap.get(courseId) || {};
          
          const grade = gradeInfo.grade || courseData.grade || '';
          const points = gradePoints[grade] || 0;
          const credits = courseData.credits || 3;
          
          if (grade) {
            totalGradePoints += points * credits;
            totalCreditsEarned += credits;
          }
          
          const attendanceValue = gradeInfo.attendance || courseData.attendancePercentage;
          if (attendanceValue) {
            totalAttendance += attendanceValue;
            attendanceCount++;
          }
          
          studentCourses.push({
            id: courseId,
            courseId: courseId,
            name: courseData.courseName || courseData.name || courseId,
            teacherName: courseData.teacherName || '',
            credits: credits,
            schedule: courseData.schedule || '',
            room: courseData.room || '',
            googleClassroomLink: courseData.googleClassroomLink || '',
            grade: grade,
            attendancePercentage: attendanceValue
          });
        }
        
        console.log('✅ Final student courses:', studentCourses);
        
        setCourses(studentCourses);
        
        if (totalCreditsEarned > 0) {
          setGpa(Number((totalGradePoints / totalCreditsEarned).toFixed(2)));
        }
        
        setTotalCredits(totalCreditsEarned);
        setAttendance(attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0);
        
      } catch (err) {
        console.error('❌ Error fetching data:', err);
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