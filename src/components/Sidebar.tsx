import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Bell,
  BookOpen,
  FileText,
  Award,
  LogOut,
  Calendar
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
    { path: '/profile', icon: User, label: 'My Profile' },
    { path: '/exams', icon: GraduationCap, label: 'Exam Portal' },
    { path: '/announcements', icon: Bell, label: 'Announcements' },
    { path: '/courses', icon: BookOpen, label: 'My Courses' },
    { path: '/materials', icon: FileText, label: 'Materials' },
    { path: '/progress', icon: Award, label: 'Progress' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <div className="h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-[#2E8B57]">AUY Portal</h1>
        <p className="text-xs text-gray-500 mt-1">American University of Yangon</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#2E8B57]'
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

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
