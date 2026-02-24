<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/grades', label: 'Grades', icon: GraduationCap },
    { path: '/materials', label: 'Materials', icon: FileText },
    { path: '/progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/10 backdrop-blur-xl rounded-xl text-white border border-white/20"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <motion.div 
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed top-0 left-0 h-full w-72 bg-white/10 backdrop-blur-xl border-r border-white/20
          z-40 overflow-y-auto
          ${!isSidebarOpen ? 'lg:translate-x-0' : ''}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">AUY Portal</h2>
            <p className="text-white/50 text-sm truncate">{user?.email}</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition mt-6"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </motion.div>

      <div className="lg:ml-72 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
=======
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
