import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

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
  studentId: string;
  major: string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

// Encode email for Firebase path
const encodeEmail = (email: string): string => {
  if (!email) return '';
  return email.replace(/\./g, ',');
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
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const email = user.email;
    setStudentEmail(email);
    
    const encodedEmail = encodeEmail(email);

    console.log('========================================');
    console.log('📧 Fetching data for email:', email);
    console.log('🔑 Encoded key:', encodedEmail);
    console.log('========================================');

    // Fetch student data
    const studentRef = ref(db, `students/${encodedEmail}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('✅ Student data loaded:', data);
        console.log('📛 Student name from Firebase:', data.studentName);
        
        // CRITICAL: Set the student name
                if (data.studentName) {
                    setStudentName(data.studentName);
                    console.log('✅ Student name set to:', data.studentName);
                  } else {
                    // Try to extract name from email or use a default
                    console.log('⚠️ No studentName field in data, trying to extract from email');
                    // If email looks like "chanmyae.au.edu.mm@gmail.com", extract the first part
                    const emailParts = email.split('@')[0];
                    const nameFromEmail = emailParts.split('.').map(part => 
                      part.charAt(0).toUpperCase() + part.slice(1)
                    ).join(' ');
                    setStudentName(nameFromEmail || 'Student');
                    console.log('✅ Generated name from email:', nameFromEmail);
                  }
        
        setStudentId(data.studentId || '');
        setMajor(data.major || 'ISP');
        setGpa(data.gpa || 0);
        setTotalCredits(data.totalCredits || 0);
        
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
          
          courseList.sort((a, b) => a.courseId.localeCompare(b.courseId));
          setCourses(courseList);
          setAttendance(courseList.length ? Math.round(totalAttendance / courseList.length) : 0);
        }
        setError(null);
      } else {
        console.log('❌ No data found for encoded path:', `students/${encodedEmail}`);
        setError('Student data not found');
      }
      setLoading(false);
    }, (error) => {
      console.error('❌ Firebase error:', error);
      setError('Failed to load data');
      setLoading(false);
    });

    // Fetch announcements
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
      studentEmail,
      studentId,
      major
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

