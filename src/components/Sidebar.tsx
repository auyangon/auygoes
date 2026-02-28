// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  Award, 
  LogOut,
  Bell,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-pink-400 to-purple-400' },
    { path: '/exams', icon: GraduationCap, label: 'Exams', gradient: 'from-purple-400 to-indigo-400' },
    { path: '/announcements', icon: Bell, label: 'Announcements', gradient: 'from-blue-400 to-cyan-400' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', gradient: 'from-teal-400 to-emerald-400' },
    { path: '/courses', icon: BookOpen, label: 'Courses', gradient: 'from-green-400 to-lime-400' },
    { path: '/materials', icon: FileText, label: 'Materials', gradient: 'from-yellow-400 to-amber-400' },
    { path: '/progress', icon: Award, label: 'Progress', gradient: 'from-orange-400 to-red-400' },
  ];

  return (
    <div className="h-full w-64 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/50 flex flex-col">
      {/* Close button for mobile */}
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>
      )}

      {/* Logo with pastel gradient */}
      <div className="p-6 border-b border-gray-100/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
          AUY Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          American University of Yangon
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-100/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-500 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
