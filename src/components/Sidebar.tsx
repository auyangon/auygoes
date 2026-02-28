// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Award, 
  LogOut,
  Bell,
  GraduationCap,
  X,
  Users
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
    { path: '/exams', icon: GraduationCap, label: 'Exam Portal' },
    { path: '/announcements', icon: Bell, label: 'Announcements' },
    { path: '/courses', icon: BookOpen, label: 'My Courses' },
    { path: '/materials', icon: FileText, label: 'Materials' },
    { path: '/progress', icon: Award, label: 'Progress' },
    { path: '/admin', icon: Users, label: 'Admin' },
  ];

  return (
    <div className="h-full w-64 bg-white shadow-xl border-r border-gray-100 flex flex-col">
      {/* Close button for mobile */}
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-[#0B4F3A] z-10"
        >
          <X size={20} />
        </button>
      )}

      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-[#0B4F3A]">
          AUY Portal
        </h1>
        <p className="text-xs text-gray-500 mt-1">
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
                      ? 'bg-[#0B4F3A] text-white shadow-md' 
                      : 'text-gray-600 hover:bg-[#e0f2fe] hover:text-[#0B4F3A]'
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
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-[#e0f2fe] hover:text-[#0B4F3A] transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
