<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { MainLayout } from "./components/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Grades } from "./pages/Grades";
import { Materials } from "./pages/Materials";
import { Progress } from "./pages/Progress";
import { SimpleLogin } from "./pages/SimpleLogin";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
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
            <Route path="/login" element={<SimpleLogin />} />
            
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
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './contexts/AuthContext'; 
import { DataProvider } from './contexts/DataContext'; 
import { ProtectedRoute } from './components/ProtectedRoute'; 
import MainLayout from './components/MainLayout'; 
import { Login } from './pages/Login'; 
import Dashboard from './pages/Dashboard'; 
import Courses from './pages/Courses'; 
import Grades from './pages/Grades'; 
import Materials from './pages/Materials'; 
import Progress from './pages/Progress'; 
 
export default function App() { 
  return ( 
    <AuthProvider> 
      <DataProvider> 
        <BrowserRouter> 
          <Routes> 
            <Route path="/login" element={<Login />} /> 
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}> 
              <Route path="/" element={<Dashboard />} /> 
              <Route path="/courses" element={<Courses />} /> 
              <Route path="/grades" element={<Grades />} /> 
              <Route path="/materials" element={<Materials />} /> 
              <Route path="/progress" element={<Progress />} /> 
            </Route> 
          </Routes> 
        </BrowserRouter> 
      </DataProvider> 
    </AuthProvider> 
  ); 
} 
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
