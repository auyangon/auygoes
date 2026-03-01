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

// Encode email for Firebase (replace dots with commas)
const encodeEmail = (email: string): string => {
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
    
    // Encode the email for Firebase lookup
    const encodedEmail = encodeEmail(email);

    console.log('========================================');
    console.log('🔍 Fetching data for email:', email);
    console.log('🔑 Encoded key:', encodedEmail);
    console.log('📁 Path:', `students/${encodedEmail}`);
    console.log('========================================');

    // DIRECT LOOKUP - using encoded email as key
    const studentRef = ref(db, `students/${encodedEmail}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 Student data:', data);
      
      if (data) {
        setStudentName(data.studentName || '');
        
        if (data.courses) {
          const courseList: Course[] = [];
          let totalAttendance = 0;
          
          Object.entries(data.courses).forEach(([courseId, courseData]: [string, any]) => {
            console.log(`📚 Course: ${courseId}`, courseData);
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
          
          console.log(`✅ Loaded ${courseList.length} courses`);
          console.log(`📊 GPA: ${gpa}, Credits: ${totalCredits}, Attendance: ${attendance}%`);
        }
        setError(null);
      } else {
        console.log('❌ No student data found for encoded key:', encodedEmail);
        setError('Student data not found');
      }
      setLoading(false);
    });

    // Get announcements
    const announcementsRef = ref(db, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          ...item
        }));
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(list);
        console.log(`✅ Loaded ${list.length} announcements`);
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
