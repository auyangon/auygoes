import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ExamProvider } from './contexts/exam/ExamContext';
import Dashboard from './pages/Dashboard';
import { Login } from './pages/Login';
import { Exams } from './pages/Exams';
import { AdminExams } from './pages/AdminExams';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ExamProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/admin/exams" element={<AdminExams />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </BrowserRouter>
        </ExamProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
