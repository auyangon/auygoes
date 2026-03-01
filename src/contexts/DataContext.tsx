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
  attendanceRecords?: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
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
  studentId: string;
  major: string;
  lastUpdated: Date | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

const EMAIL_TO_ID: Record<string, string> = {
  'aung.khant.phyo@student.au.edu.mm': 'S001',
  'hsu.eain.htet@student.au.edu.mm': 'S002',
  'htoo.yadanar.oo@student.au.edu.mm': 'S003',
  'chanmyae.au.edu.mm@gmail.com': 'S004',
  'kaung.pyae.phyo.kyaw@gmail.com': 'S005',
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
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const studentIdFromEmail = EMAIL_TO_ID[user.email];
    if (!studentIdFromEmail) {
      setError('Student record not found');
      setLoading(false);
      return;
    }

    setStudentId(studentIdFromEmail);

    // REAL-TIME LISTENERS - Update instantly when Firebase changes

    // 1. Listen to student data
    const studentRef = ref(db, `students/${studentIdFromEmail}`);
    const unsubscribeStudent = onValue(studentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStudentName(data.studentName || '');
        setMajor(data.major || 'ISP');
      }
      setLastUpdated(new Date());
    });

    // 2. Listen to enrollments
    const enrollmentsRef = ref(db, 'enrollments');
    const unsubscribeEnrollments = onValue(enrollmentsRef, (snapshot) => {
      const data = snapshot.val();
      const courseList: Course[] = [];
      
      if (data) {
        Object.values(data).forEach((enroll: any) => {
          if (enroll.studentId === studentIdFromEmail) {
            courseList.push({
              id: enroll.courseId,
              courseId: enroll.courseId,
              name: enroll.courseName || enroll.courseId,
              teacher: enroll.teacherName || '',
              credits: parseInt(enroll.credits) || 3,
              grade: enroll.grade || '',
              attendancePercentage: parseInt(enroll.attendancePercentage) || 0,
              attendanceRecords: []
            });
          }
        });
      }
      
      setCourses(courseList);
      
      // Calculate GPA
      let totalPoints = 0;
      let totalCreditsEarned = 0;
      
      courseList.forEach((course) => {
        if (course.grade && gradePoints[course.grade]) {
          totalPoints += gradePoints[course.grade] * course.credits;
          totalCreditsEarned += course.credits;
        }
      });
      
      setGpa(totalCreditsEarned ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
      setTotalCredits(totalCreditsEarned);
      setLastUpdated(new Date());
    });

    // 3. Listen to announcements
    const announcementsRef = ref(db, 'announcements');
    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const annList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        annList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(annList);
      }
      setLastUpdated(new Date());
    });

    // 4. Listen to attendance for this student
    const attendanceRef = ref(db, 'attendance');
    const unsubscribeAttendance = onValue(attendanceRef, (snapshot) => {
      const data = snapshot.val();
      const records: AttendanceRecord[] = [];
      let totalAttendance = 0;
      
      if (data) {
        Object.values(data).forEach((record: any) => {
          if (record.studentId === studentIdFromEmail) {
            records.push({
              id: record.id,
              date: record.date,
              status: record.status,
              notes: record.notes
            });
            
            // Count for attendance percentage
            if (record.status === 'present' || record.status === 'late') {
              totalAttendance++;
            }
          }
        });
      }
      
      setAttendanceRecords(records);
      
      // Update attendance percentage in courses
      setCourses(prev => prev.map(course => {
        const courseRecords = records.filter(r => r.courseId === course.courseId);
        const present = courseRecords.filter(r => r.status === 'present' || r.status === 'late').length;
        const percentage = courseRecords.length ? Math.round((present / courseRecords.length) * 100) : 0;
        return { ...course, attendancePercentage: percentage, attendanceRecords: courseRecords };
      }));
      
      // Calculate overall attendance
      const totalClasses = records.length;
      const presentCount = records.filter(r => r.status === 'present' || r.status === 'late').length;
      setAttendance(totalClasses ? Math.round((presentCount / totalClasses) * 100) : 0);
      
      setLastUpdated(new Date());
      setLoading(false);
    });

    return () => {
      unsubscribeStudent();
      unsubscribeEnrollments();
      unsubscribeAnnouncements();
      unsubscribeAttendance();
    };
  }, [user]);

  return (
    <DataContext.Provider value={{
      courses, announcements, attendanceRecords, loading, error, 
      gpa, totalCredits, attendance, studentName, studentId, major, lastUpdated
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
