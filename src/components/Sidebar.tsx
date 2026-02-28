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
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/exams', icon: GraduationCap, label: 'Exams' },
    { path: '/announcements', icon: Bell, label: 'Announcements' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/materials', icon: FileText, label: 'Materials' },
    { path: '/progress', icon: Award, label: 'Progress' },
  ];

  return (
    <div className="h-full w-64 backdrop-blur-xl bg-white/70 shadow-xl border-r border-white/20 flex flex-col">
      {/* Close button for mobile */}
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={20} />
        </button>
      )}

      {/* Logo with gradient */}
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-bold" style={{ 
          background: 'linear-gradient(135deg, #0B4F3A 0%, #1a4f8b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>AUY Portal</h1>
        <p className="text-xs text-gray-600/80 mt-1">American University of Yangon</p>
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
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all backdrop-blur-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#0B4F3A]/90 to-[#1a4f8b]/90 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-white/50 hover:backdrop-blur-sm hover:text-[#1a4f8b]'
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
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-red-50/80 hover:backdrop-blur-sm hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
