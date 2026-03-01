// src/contexts/DataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { encodeEmailForFirebase } from '../utils/emailUtils';

export interface Course {
  id: string;
  courseId: string;
  name: string;
  teacher: string;
  credits: number;
  grade?: string;
  attendancePercentage?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

interface DataContextType {
  courses: Course[];
  announcements: Announcement[];
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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
    
    // Encode email for Firebase path
    const encodedEmail = encodeEmailForFirebase(email);

    console.log('========================================');
    console.log('📧 Original email:', email);
    console.log('🔑 Encoded email:', encodedEmail);
    console.log('📁 Firebase path:', `students/${encodedEmail}`);
    console.log('========================================');

    // Fetch student data
    const studentRef = ref(db, `students/${encodedEmail}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('✅ Student data found:', data);
        
        setStudentName(data.studentName || '');
        
        if (data.courses) {
          const courseList: Course[] = [];
          let totalAttendanceSum = 0;
          
          Object.entries(data.courses).forEach(([courseId, courseData]: [string, any]) => {
            courseList.push({
              id: courseId,
              courseId: courseId,
              name: courseData.courseName,
              teacher: courseData.teacherName,
              credits: courseData.credits || 3,
              grade: courseData.grade || '',
              attendancePercentage: courseData.attendancePercentage || 0
            });
            totalAttendanceSum += courseData.attendancePercentage || 0;
          });
          
          setCourses(courseList);
          
          // Calculate GPA
          let totalPoints = 0;
          let totalCreditsEarned = 0;
          
          courseList.forEach(course => {
            if (course.grade && gradePoints[course.grade]) {
              totalPoints += gradePoints[course.grade] * course.credits;
              totalCreditsEarned += course.credits;
            }
          });
          
          setGpa(totalCreditsEarned ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
          setTotalCredits(totalCreditsEarned);
          setAttendance(courseList.length ? Math.round(totalAttendanceSum / courseList.length) : 0);
        }
        setError(null);
      } else {
        console.log('❌ No data found for encoded path:', `students/${encodedEmail}`);
        setError('Student data not found. Please contact administration.');
      }
      setLoading(false);
    }, (error) => {
      console.error('❌ Firebase error:', error);
      setError('Failed to load student data');
      setLoading(false);
    });

    // Fetch announcements (no encoding needed)
    const announcementsRef = ref(db, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          title: item.title || '',
          content: item.content || '',
          date: item.date || '',
          author: item.author || 'Admin'
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


