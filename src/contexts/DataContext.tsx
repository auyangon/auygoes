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
        // STEP 1: FIND STUDENT BY EMAIL from CSV data
        // We need to know which courses this student is enrolled in
        // ===========================================
        
        // For now, we'll create a mapping based on your CSV data
        // This is a temporary solution until you upload CSV to Firebase
        const studentCoursesMap: Record<string, string[]> = {
          'jinochan1991@gmail.com': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'aung.khant.phyo@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'hsu.eain.htet@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'htoo.yadanar.oo@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'kaung.pyae.phyo.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'man.sian.hoih@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'phone.pyae.han@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thin.zar.li.htay@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'yoon.thiri.naing@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'zau.myu.lat@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'en.sian.piang@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'hsu.kyal.sin.zaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'kaung.khant.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'may.lin.phyu@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'min.hein.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thint.myat.aung@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'chan.htet.zan@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'swan.sa.phyo@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'mya.hmue.may.zaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'kaung.nyan.lin@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thaw.thaw.zin@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'l.seng.rail@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'min.hein.khant@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thawdar.shoon.lei@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'sian.san.nuam@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'zaw.seng.awng@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thet.hayman.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'aung.khant.zaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'aung.kyaw.min@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'aye.chan.myae.aung@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'eaint.myat.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'hnin.wai.phyo@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'hpa.la.hpone.ram@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'hsu.pyae.la.min@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'indira@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'la.mye.gyung.naw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'la.pyae.chit@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'lin.sandar.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'min.thiha.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'nan.moe.nwe.oo@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'nlang.seng.htoi.pan@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'nlang.seng.myo.myat@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'shoon.lae.aung@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'su.pyae.than.dar@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thin.thin.aung@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thiri.thansin@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'yatanar.moe@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'htut.khaung.oo@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'mung.hkawng.la@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'thet.mon.chit@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'myat.thiri.kyaw@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'aye.chan.pyone@student.au.edu.mm': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'chanmyae.au.edu.mm@gmail.com': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'jbthaw@gmail.com': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'hninyamoneoo.au.edu@gmail.com': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'],
          'moh.au.edu@gmail.com': ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100']
        };

        // Get the list of courses this student is enrolled in
        const enrolledCourseIds = studentCoursesMap[user.email] || [];
        
        console.log('🎯 Student enrolled courses:', enrolledCourseIds);
        
        // Set student name from email (or you can fetch from Firebase later)
        const nameFromEmail = user.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setStudentName(nameFromEmail || 'Student');
        setStudentId('S' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
        setMajor('ISP Program');
        
        // ===========================================
        // STEP 2: GET COURSE DETAILS FROM FIREBASE
        // ===========================================
        const courseList: Course[] = [];
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;
        let attendanceCount = 0;
        
        // List of all possible courses from your Firebase
        const allCourseIds = ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'];
        
        for (const courseId of allCourseIds) {
          // Only include courses this student is enrolled in
          if (!enrolledCourseIds.includes(courseId)) continue;
          
          const courseData = allData[courseId];
          
          if (courseData) {
            console.log(`📖 Found course ${courseId}:`, courseData);
            
            courseList.push({
              id: courseId,
              courseId: courseId,
              name: courseData.courseName || courseId,
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
        
        console.log('✅ Courses for this student:', courseList);
        
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