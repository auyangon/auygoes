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
  attendanceSummary?: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
}

export interface AttendanceRecord {
  id: string;
  studentEmail: string;
  courseId: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  notes?: string;
}

interface DataContextType {
  courses: Course[];
  announcements: any[];
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  gpa: number;
  totalCredits: number;
  attendance: number;
  studentName: string;
  studentEmail: string;
  major: string;
  lastUpdated: Date | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

// Firebase doesn't allow dots in paths, so encode email
const encodeEmail = (email: string): string => {
  return email.replace(/\./g, ','); // Replace dots with commas
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [major, setMajor] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const email = user.email;
    setStudentEmail(email);
    
    // Encode email for Firebase path (dots -> commas)
    const encodedEmail = encodeEmail(email);
    
    console.log('========================================');
    console.log('?? Fetching data for email:', email);
    console.log('?? Firebase path:', `students/${encodedEmail}`);
    console.log('========================================`)');

    // REAL-TIME STUDENT DATA - Direct lookup by email!
    const studentRef = ref(db, `students/${encodedEmail}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStudentName(data.studentName || '');
        setMajor(data.major || 'ISP');
        
        // If student has courses directly under them
        if (data.courses) {
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
        }
      }
      setLastUpdated(new Date());
    });

    // REAL-TIME ATTENDANCE RECORDS - Filter by student email
    const attendanceRef = ref(db, 'attendance');
    const unsubscribeAttendance = onValue(attendanceRef, (snapshot) => {
      const data = snapshot.val();
      const records: AttendanceRecord[] = [];
      const courseStats: Map<string, { present: number; late: number; absent: number; total: number }> = new Map();
      
      let totalPresent = 0;
      let totalClasses = 0;
      
      if (data) {
        Object.values(data).forEach((record: any) => {
          // Match by email (your Firebase uses email as reference)
          if (record.studentEmail === email) {
            records.push({
              id: record.id,
              studentEmail: record.studentEmail,
              courseId: record.courseId,
              date: record.date,
              status: record.status,
              notes: record.notes
            });
            
            // Update course stats
            if (!courseStats.has(record.courseId)) {
              courseStats.set(record.courseId, { present: 0, late: 0, absent: 0, total: 0 });
            }
            const stats = courseStats.get(record.courseId)!;
            stats.total++;
            if (record.status === 'present') stats.present++;
            else if (record.status === 'late') stats.late++;
            else if (record.status === 'absent') stats.absent++;
            
            // Update overall stats
            if (record.status === 'present' || record.status === 'late') {
              totalPresent++;
            }
            totalClasses++;
          }
        });
      }
      
      setAttendanceRecords(records);
      
      // Update courses with attendance stats
      setCourses(prevCourses => 
        prevCourses.map(course => {
          const stats = courseStats.get(course.courseId);
          if (stats) {
            const percentage = stats.total ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;
            return {
              ...course,
              attendancePercentage: percentage,
              attendanceSummary: stats
            };
          }
          return { ...course, attendancePercentage: 0 };
        })
      );
      
      setAttendance(totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0);
      setLastUpdated(new Date());
    });

    // REAL-TIME ANNOUNCEMENTS
    const announcementsRef = ref(db, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(list);
      }
    });

    setLoading(false);

    return () => {
      unsubscribeStudent();
      unsubscribeAttendance();
      unsubscribeAnnouncements();
    };
  }, [user]);

  // Calculate GPA
  useEffect(() => {
    let totalPoints = 0;
    let totalCreditsEarned = 0;

    courses.forEach((course) => {
      if (course.grade && gradePoints[course.grade]) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCreditsEarned += course.credits;
      }
    });

    setGpa(totalCreditsEarned ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
    setTotalCredits(totalCreditsEarned);
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
      major,
      lastUpdated
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

