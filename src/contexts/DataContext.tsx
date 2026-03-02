import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { firebaseRest } from '../services/firebaseRest.service';

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
  studentName?: string;
  courseId: string;
  date: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  notes?: string;
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
  studentId: string;
  major: string;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}`n  lastUpdated: Date | null;

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
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
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Fetching data via REST API for:', user.email);
      
      // Get all data in parallel
      const [studentData, attendanceData, announcementsData, coursesData] = await Promise.all([
        firebaseRest.getStudent(user.email),
        firebaseRest.getStudentAttendance(user.email),
        firebaseRest.getAnnouncements(),
        firebaseRest.getCourses()
      ]);

      console.log('✅ Student data:', studentData);
      
      // Process student data
      if (studentData) {
        setStudentName(studentData.studentName || '');
        setStudentId(studentData.studentId || '');
        setMajor(studentData.major || 'ISP');
        setGpa(studentData.gpa || 0);
        setTotalCredits(studentData.totalCredits || 0);
        
        // Process courses
        if (studentData.courses) {
          const courseList: Course[] = [];
          let totalAttendanceSum = 0;
          
          Object.entries(studentData.courses).forEach(([courseId, courseData]: [string, any]) => {
            courseList.push({
              id: courseId,
              courseId: courseId,
              name: courseData.courseName || courseId,
              teacher: courseData.teacherName || 'Staff',
              credits: courseData.credits || 3,
              grade: courseData.grade || '',
              attendancePercentage: courseData.attendancePercentage || 0
            });
            totalAttendanceSum += courseData.attendancePercentage || 0;
          });
          
          courseList.sort((a, b) => a.courseId.localeCompare(b.courseId));
          setCourses(courseList);
          setAttendance(courseList.length ? Math.round(totalAttendanceSum / courseList.length) : 0);
        }
      } else {
        console.log('⚠️ No student data found');
      }
      
      // Process attendance records
      if (attendanceData) {
        const records: AttendanceRecord[] = [];
        Object.entries(attendanceData).forEach(([id, record]: [string, any]) => {
          if (record.studentEmail === user.email) {
            records.push({
              id,
              studentEmail: record.studentEmail,
              studentName: record.studentName,
              courseId: record.courseId,
              date: record.date,
              status: record.status,
              notes: record.notes
            });
          }
        });
        records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAttendanceRecords(records);
      }
      
      // Process announcements
      if (announcementsData) {
        const list = Object.entries(announcementsData).map(([id, item]: [string, any]) => ({
          id,
          title: item.title || '',
          content: item.content || '',
          date: item.date || '',
          author: item.author || 'Admin'
        }));
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(list);
      }
      
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Failed to load data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and set up polling
  useEffect(() => {
    if (user?.email) {
      fetchData();
      
      // Poll every 30 seconds instead of real-time connection
      const interval = setInterval(fetchData, 30000);
      
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [user]);

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
      studentId,
      major, lastUpdated,
      lastUpdated,
      refreshData: fetchData
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

