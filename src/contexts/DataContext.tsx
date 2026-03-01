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

export interface AttendanceRecord {
  id: string;
  studentEmail: string;
  courseId: string;
  date: string;
  status: 'present' | 'late' | 'absent';
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
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  gpa: number;
  totalCredits: number;
  attendance: number;
  studentName: string;
  studentEmail: string;
  major: string;
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
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
    console.log('🔍 Fetching data for email:', email);
    console.log('📁 Firebase path:', `students/${encodedEmail}`);
    console.log('========================================');

    // 1. FETCH STUDENT DATA
    const studentRef = ref(db, `students/${encodedEmail}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📊 Student data from Firebase:', data);
      
      if (data) {
        setStudentName(data.studentName || '');
        setMajor(data.major || 'ISP');
        
        // Check if student has courses directly under them
        if (data.courses) {
          console.log('📚 Courses found:', data.courses);
          const courseList: Course[] = [];
          
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
          });
          
          setCourses(courseList);
          console.log(`✅ Loaded ${courseList.length} courses from student data`);
        } else {
          console.log('⚠️ No courses found in student data');
        }
      } else {
        console.log('❌ No student data found in Firebase for:', email);
        setError('Student record not found');
      }
    });

    // 2. FETCH ANNOUNCEMENTS
    const announcementsRef = ref(db, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          title: item.title || '',
          content: item.content || '',
          date: item.date || '',
          author: item.author || 'Admin'
        }));
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(list);
        console.log(`✅ Loaded ${list.length} announcements`);
      }
    });

    // 3. FETCH ATTENDANCE
    const attendanceRef = ref(db, 'attendance');
    const unsubscribeAttendance = onValue(attendanceRef, (snapshot) => {
      const data = snapshot.val();
      const records: AttendanceRecord[] = [];
      
      if (data) {
        Object.entries(data).forEach(([id, record]: [string, any]) => {
          if (record.studentEmail === email) {
            records.push({
              id,
              studentEmail: record.studentEmail,
              courseId: record.courseId,
              date: record.date,
              status: record.status
            });
          }
        });
      }
      
      setAttendanceRecords(records);
      console.log(`✅ Loaded ${records.length} attendance records`);
    });

    setLoading(false);

    return () => {
      unsubscribeStudent();
      unsubscribeAnnouncements();
      unsubscribeAttendance();
    };
  }, [user]);

  // Calculate GPA whenever courses change
  useEffect(() => {
    let totalPoints = 0;
    let totalCreditsEarned = 0;
    let totalAttendance = 0;
    let courseCount = 0;

    courses.forEach((course) => {
      if (course.grade && gradePoints[course.grade]) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCreditsEarned += course.credits;
      }
      if (course.attendancePercentage) {
        totalAttendance += course.attendancePercentage;
        courseCount++;
      }
    });

    setGpa(totalCreditsEarned ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
    setTotalCredits(totalCreditsEarned);
    setAttendance(courseCount ? Math.round(totalAttendance / courseCount) : 0);
    
    console.log('📊 Updated stats:', {
      courses: courses.length,
      gpa: totalCreditsEarned ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0,
      credits: totalCreditsEarned,
      attendance: courseCount ? Math.round(totalAttendance / courseCount) : 0
    });
  }, [courses]);

  return (
    <DataContext.Provider value={{
      courses,
      announcements,
      attendanceRecords,
      loading,
      error,
      gpa,
      totalCredits,
      attendance,
      studentName,
      studentEmail,
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
