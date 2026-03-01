import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { AuthProvider } from './contexts/AuthContext';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataProvider } from './contexts/DataContext';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import Dashboard from './pages/Dashboard';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import Login from './pages/Login';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { Profile } from './pages/Profile';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { Courses } from './pages/Courses';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseDetail } from './pages/CourseDetail';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { Materials } from './pages/Materials';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { Progress } from './pages/Progress';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { Grades } from './pages/Grades';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { AUYExams } from './pages/AUYExams';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { MainLayout } from './components/MainLayout';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';
import { CourseAttendance } from './pages/CourseAttendance';
import { DebugFirebase } from './pages/DebugFirebase';
import { DataVerify } from './pages/DataVerify';
import { DebugFirebase } from './pages/DebugFirebase';

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
                      <Route path="/verify" element={<DataVerify />} />`n                      <Route path="/debug" element={<DebugFirebase />} />`n          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;



