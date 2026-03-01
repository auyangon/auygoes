import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { Profile } from './pages/Profile';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Materials } from './pages/Materials';
import { Progress } from './pages/Progress';
import { Grades } from './pages/Grades';
import { AUYExams } from './pages/AUYExams';
import { MainLayout } from './components/MainLayout';

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
