import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

interface Course {
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
  announcements: any[];
  loading: boolean;
  error: string | null;
  gpa: number;
  totalCredits: number;
  attendance: number;
  studentName: string;
  studentEmail: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

// SIMPLE EMAIL ENCODING - Replace dots with commas
const encodeEmail = (email: string): string => {
  if (!email) return '';
  return email.replace(/\./g, ',');
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const email = user.email;
    setStudentEmail(email);
    
    // ENCODE THE EMAIL - THIS IS THE KEY FIX!
    const encodedEmail = encodeEmail(email);
    
    // Show what's happening
    console.log('🔍 ORIGINAL EMAIL:', email);
    console.log('🔑 ENCODED EMAIL:', encodedEmail);
    console.log('📁 FIREBASE PATH:', `students/${encodedEmail}`);

    // USE ENCODED EMAIL FOR FIREBASE PATH
    const studentRef = ref(db, `students/${encodedEmail}`);
    
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('✅ STUDENT FOUND:', data);
        
        setStudentName(data.studentName || '');
        
        if (data.courses) {
          const courseList: Course[] = [];
          let totalAttendance = 0;
          
          Object.entries(data.courses).forEach(([courseId, courseData]: [string, any]) => {
            courseList.push({
              id: courseId,
              courseId: courseId,
              name: courseData.courseName || courseId,
              teacher: courseData.teacherName || 'Staff',
              credits: courseData.credits || 3,
              grade: courseData.grade || '',
              attendancePercentage: courseData.attendancePercentage || 0
            });
            totalAttendance += courseData.attendancePercentage || 0;
          });
          
          setCourses(courseList);
          
          // Calculate GPA
          let totalPoints = 0;
          let totalCredits = 0;
          
          courseList.forEach(course => {
            if (course.grade && gradePoints[course.grade]) {
              totalPoints += gradePoints[course.grade] * course.credits;
              totalCredits += course.credits;
            }
          });
          
          setGpa(totalCredits ? Number((totalPoints / totalCredits).toFixed(2)) : 0);
          setTotalCredits(totalCredits);
          setAttendance(courseList.length ? Math.round(totalAttendance / courseList.length) : 0);
        }
        setError(null);
      } else {
        console.log('❌ NO DATA AT PATH:', `students/${encodedEmail}`);
        
        // Try to list all students to see what's available
        const allStudentsRef = ref(db, 'students');
        onValue(allStudentsRef, (allSnapshot) => {
          if (allSnapshot.exists()) {
            const keys = Object.keys(allSnapshot.val());
            console.log('📋 AVAILABLE STUDENT KEYS:', keys);
            
            // Check if any key contains part of the email
            const emailPart = email.split('@')[0].replace(/\./g, ',');
            const possibleMatch = keys.find(key => key.includes(emailPart));
            if (possibleMatch) {
              console.log('💡 POSSIBLE MATCH:', possibleMatch);
              console.log('💡 TRY LOGGING IN WITH THIS EMAIL INSTEAD');
            }
          }
        }, { onlyOnce: true });
        
        setError('Student data not found');
      }
      setLoading(false);
    }, (error) => {
      console.error('❌ FIREBASE ERROR:', error);
      setError('Failed to load student data');
      setLoading(false);
    });

    // Get announcements (no encoding needed)
    const announcementsRef = ref(db, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          ...item
        }));
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(list);
      }
    });

    return () => {
      unsubscribeStudent();
      unsubscribeAnnouncements();
    };
  }, [user]);

  return (
    <DataContext.Provider value={{
      courses,
      announcements,
      loading,
      error,
      gpa,
      totalCredits,
      attendance,
      studentName,
      studentEmail
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
