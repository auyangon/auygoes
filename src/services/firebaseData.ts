<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // ✅ FIXED PATH
import { DataProvider } from "./contexts/DataContext";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Grades } from "./pages/Grades";
import { Materials } from "./pages/Materials";
import { Progress } from "./pages/Progress";
import { LoginPage } from "./pages/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/grades"
              element={
                <ProtectedRoute>
                  <Grades />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <Materials />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
=======
import { ref, get } from 'firebase/database';
import { db } from '../lib/firebase';

export interface Student {
  studentId: string;
  studentName: string;
  email: string;
  studyMode: string;
  major: string;
}

export interface Course {
  courseId: string;
  courseName: string;
  teacherName: string;
  credits: number;
  googleClassroomLink: string;
}

export interface StudentCourse {
  studentId: string;
  courseId: string;
  grade: string;
  credits: number;
  attendancePercentage: number;
  lastUpdated: string;
}

export interface EnrichedCourse extends StudentCourse {
  courseName: string;
  teacherName: string;
  googleClassroomLink: string;
}

export const GRADE_POINTS: Record<string, number> = {
  'A': 4.0,
  'A+': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export function calculateGPA(courses: EnrichedCourse[]): number {
  const graded = courses.filter(c => c.grade && GRADE_POINTS[c.grade] !== undefined);
  if (graded.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of graded) {
    const gp = GRADE_POINTS[c.grade] ?? 0;
    totalPoints += gp * c.credits;
    totalCredits += c.credits;
  }
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function calculateTotalCredits(courses: EnrichedCourse[]): number {
  return courses
    .filter(c => c.grade && c.grade !== 'F' && GRADE_POINTS[c.grade] !== undefined)
    .reduce((sum, c) => sum + c.credits, 0);
}

export function calculateAverageAttendance(courses: EnrichedCourse[]): number {
  if (courses.length === 0) return 0;
  const total = courses.reduce((sum, c) => sum + (c.attendancePercentage || 0), 0);
  return total / courses.length;
}

export async function fetchStudentByEmail(email: string): Promise<Student | null> {
  try {
    const studentsRef = ref(db, 'students');
    const snapshot = await get(studentsRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.val() as Record<string, Student>;
    for (const key of Object.keys(data)) {
      if (data[key].email?.toLowerCase() === email.toLowerCase()) {
        return data[key];
      }
    }
    return null;
  } catch (err) {
    console.error('Error fetching student:', err);
    return null;
  }
}

export async function fetchStudentCourses(studentId: string): Promise<StudentCourse[]> {
  try {
    const scRef = ref(db, 'studentCourses');
    const snapshot = await get(scRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val() as Record<string, StudentCourse>;
    return Object.values(data).filter(sc => sc.studentId === studentId);
  } catch (err) {
    console.error('Error fetching student courses:', err);
    return [];
  }
}

export async function fetchAllCourses(): Promise<Record<string, Course>> {
  try {
    const coursesRef = ref(db, 'courses');
    const snapshot = await get(coursesRef);
    if (!snapshot.exists()) return {};
    return snapshot.val() as Record<string, Course>;
  } catch (err) {
    console.error('Error fetching courses:', err);
    return {};
  }
}

export function enrichCourses(
  studentCourses: StudentCourse[],
  allCourses: Record<string, Course>
): EnrichedCourse[] {
  return studentCourses.map(sc => {
    const course = allCourses[sc.courseId];
    return {
      ...sc,
      courseName: course?.courseName ?? sc.courseId,
      teacherName: course?.teacherName ?? 'TBA',
      googleClassroomLink: course?.googleClassroomLink ?? '#',
    };
  });
}

export const MOCK_STUDENT: Student = {
  studentId: 'AUY-2024-001',
  studentName: 'Demo Student',
  email: 'demo@auy.edu.mm',
  studyMode: 'Full-Time',
  major: 'Computer Science',
};

export const MOCK_ENRICHED_COURSES: EnrichedCourse[] = [
  {
    studentId: 'AUY-2024-001',
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    teacherName: 'Dr. Sarah Chen',
    credits: 3,
    grade: 'A',
    attendancePercentage: 95,
    lastUpdated: '2024-12-01',
    googleClassroomLink: '#',
  },
  {
    studentId: 'AUY-2024-001',
    courseId: 'MATH201',
    courseName: 'Calculus II',
    teacherName: 'Prof. James Liu',
    credits: 4,
    grade: 'B+',
    attendancePercentage: 88,
    lastUpdated: '2024-12-01',
    googleClassroomLink: '#',
  },
  {
    studentId: 'AUY-2024-001',
    courseId: 'ENG102',
    courseName: 'Academic Writing',
    teacherName: 'Dr. Emily Park',
    credits: 3,
    grade: 'A-',
    attendancePercentage: 92,
    lastUpdated: '2024-12-01',
    googleClassroomLink: '#',
  },
  {
    studentId: 'AUY-2024-001',
    courseId: 'PHY101',
    courseName: 'Physics I',
    teacherName: 'Dr. Michael Torres',
    credits: 4,
    grade: 'B',
    attendancePercentage: 85,
    lastUpdated: '2024-12-01',
    googleClassroomLink: '#',
  },
  {
    studentId: 'AUY-2024-001',
    courseId: 'CS201',
    courseName: 'Data Structures & Algorithms',
    teacherName: 'Dr. Aung Kyaw',
    credits: 3,
    grade: 'A',
    attendancePercentage: 97,
    lastUpdated: '2024-12-01',
    googleClassroomLink: '#',
  },
  {
    studentId: 'AUY-2024-001',
    courseId: 'BUS101',
    courseName: 'Principles of Management',
    teacherName: 'Prof. Linda Nguyen',
    credits: 3,
    grade: 'B+',
    attendancePercentage: 90,
    lastUpdated: '2024-12-01',
    googleClassroomLink: '#',
  },
];
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
