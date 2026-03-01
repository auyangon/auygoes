import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CourseAttendance } from './pages/CourseAttendance';
import { AuthProvider } from './contexts/AuthContext';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataProvider } from './contexts/DataContext';
import { CourseAttendance } from './pages/CourseAttendance';
import Dashboard from './pages/Dashboard';
import { CourseAttendance } from './pages/CourseAttendance';
import Login from './pages/Login';
import { CourseAttendance } from './pages/CourseAttendance';
import { Profile } from './pages/Profile';
import { CourseAttendance } from './pages/CourseAttendance';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { CourseAttendance } from './pages/CourseAttendance';
import { Courses } from './pages/Courses';
import { CourseAttendance } from './pages/CourseAttendance';
import { CourseDetail } from './pages/CourseDetail';
import { CourseAttendance } from './pages/CourseAttendance';
import { Materials } from './pages/Materials';
import { CourseAttendance } from './pages/CourseAttendance';
import { Progress } from './pages/Progress';
import { CourseAttendance } from './pages/CourseAttendance';
import { Grades } from './pages/Grades';
import { CourseAttendance } from './pages/CourseAttendance';
import { AUYExams } from './pages/AUYExams';
import { CourseAttendance } from './pages/CourseAttendance';
import { MainLayout } from './components/MainLayout';
import { CourseAttendance } from './pages/CourseAttendance';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            } />
            <Route path="/profile" element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            } />
            <Route path="/exams" element={
              <ProtectedLayout>
                <AUYExams />
              </ProtectedLayout>
            } />
            <Route path="/announcements" element={
              <ProtectedLayout>
                <AnnouncementsPage />
              </ProtectedLayout>
            } />
            <Route path="/courses" element={
              <ProtectedLayout>
                <Courses />
              </ProtectedLayout>
            } />
            <Route path="/course/:courseId" element={
              <ProtectedLayout>
                <CourseDetail />
              </ProtectedLayout>
            } />
            <Route path="/materials" element={
              <ProtectedLayout>
                <Materials />
              </ProtectedLayout>
            } />
            <Route path="/progress" element={
              <ProtectedLayout>
                <Progress />
              </ProtectedLayout>
            } />
            <Route path="/grades" element={
              <ProtectedLayout>
                <Grades />
              </ProtectedLayout>
            } />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

