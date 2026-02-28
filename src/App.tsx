import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { PublicQExams } from './pages/PublicQExams';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { MainLayout } from './components/MainLayout';

// Wrapper component to apply MainLayout to pages
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exams" element={
              <WithLayout>
                <PublicQExams />
              </WithLayout>
            } />
            <Route path="/announcements" element={
              <WithLayout>
                <AnnouncementsPage />
              </WithLayout>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
