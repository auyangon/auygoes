import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseTest } from './pages/FirebaseTest';
import { AuthProvider } from './contexts/AuthContext';
import { FirebaseTest } from './pages/FirebaseTest';
import { DataProvider } from './contexts/DataContext';
import { FirebaseTest } from './pages/FirebaseTest';
import Dashboard from './pages/Dashboard';
import { FirebaseTest } from './pages/FirebaseTest';
import Login from './pages/Login';
import { FirebaseTest } from './pages/FirebaseTest';
import { VerifyData } from './pages/VerifyData';
import { FirebaseTest } from './pages/FirebaseTest';
import { MainLayout } from './components/MainLayout';
import { FirebaseTest } from './pages/FirebaseTest';

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
                      <Route path="/firebase-test" element={<FirebaseTest />} />`n          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;


