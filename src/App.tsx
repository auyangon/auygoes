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
