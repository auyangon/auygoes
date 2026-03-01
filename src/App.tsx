import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { AuthProvider } from './contexts/AuthContext';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { DataProvider } from './contexts/DataContext';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import Dashboard from './pages/Dashboard';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import Login from './pages/Login';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { Profile } from './pages/Profile';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { Courses } from './pages/Courses';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { CourseDetail } from './pages/CourseDetail';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { Materials } from './pages/Materials';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { Progress } from './pages/Progress';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { Grades } from './pages/Grades';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { AUYExams } from './pages/AUYExams';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';
import { MainLayout } from './components/MainLayout';
import { DataVerify } from './pages/DataVerify';
import { CourseAttendance } from './pages/CourseAttendance';
import { DataVerify } from './pages/DataVerify';

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
                      <Route path="/verify" element={<DataVerify />} />`n          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;


