import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConnectionStatus } from './components/ConnectionStatus';
import { AuthProvider } from './contexts/AuthContext';
import { ConnectionStatus } from './components/ConnectionStatus';
import { DataProvider } from './contexts/DataContext';
import { ConnectionStatus } from './components/ConnectionStatus';
import Dashboard from './pages/Dashboard';
import { ConnectionStatus } from './components/ConnectionStatus';
import Login from './pages/Login';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Profile } from './pages/Profile';
import { ConnectionStatus } from './components/ConnectionStatus';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Courses } from './pages/Courses';
import { ConnectionStatus } from './components/ConnectionStatus';
import { CourseAttendance } from './pages/CourseAttendance';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Materials } from './pages/Materials';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Progress } from './pages/Progress';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Grades } from './pages/Grades';
import { ConnectionStatus } from './components/ConnectionStatus';
import { AUYExams } from './pages/AUYExams';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Calendar } from './pages/Calendar';
import { ConnectionStatus } from './components/ConnectionStatus';
import { FirebaseTest } from './pages/FirebaseTest';
import { ConnectionStatus } from './components/ConnectionStatus';
import { VerifyData } from './pages/VerifyData';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MainLayout } from './components/MainLayout';
import { ConnectionStatus } from './components/ConnectionStatus';

// Wrapper for pages that need the layout
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

function App() {`n  const { lastUpdated, refreshData } = useData();
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            {/* Protected routes with layout */}
            <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
            <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
            <Route path="/exams" element={<ProtectedLayout><AUYExams /></ProtectedLayout>} />
            <Route path="/announcements" element={<ProtectedLayout><AnnouncementsPage /></ProtectedLayout>} />
            <Route path="/courses" element={<ProtectedLayout><Courses /></ProtectedLayout>} />
            <Route path="/course/:courseId" element={<ProtectedLayout><CourseAttendance /></ProtectedLayout>} />
            <Route path="/materials" element={<ProtectedLayout><Materials /></ProtectedLayout>} />
            <Route path="/progress" element={<ProtectedLayout><Progress /></ProtectedLayout>} />
            <Route path="/grades" element={<ProtectedLayout><Grades /></ProtectedLayout>} />
            <Route path="/calendar" element={<ProtectedLayout><Calendar /></ProtectedLayout>} />
            <Route path="/firebase-test" element={<ProtectedLayout><FirebaseTest /></ProtectedLayout>} />
            <Route path="/verify" element={<ProtectedLayout><VerifyData /></ProtectedLayout>} />
                    </Routes>
          <ConnectionStatus lastUpdated={lastUpdated} onRefresh={refreshData} />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;





