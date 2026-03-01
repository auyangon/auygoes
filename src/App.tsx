import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { VerifyData } from './pages/VerifyData';
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
            <Route path="/verify" element={
              <ProtectedLayout>
                <VerifyData />
              </ProtectedLayout>
            } />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

