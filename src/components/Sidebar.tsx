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
    <div className="h-full w-64 backdrop-blur-xl bg-white/10 border-r border-white/20 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-light text-white">AUY Portal</h1>
        <p className="text-xs text-white/60 mt-1">American University of Yangon</p>
      </div>

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
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-light">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={20} />
          <span className="font-light">Logout</span>
        </button>
      </div>
    </div>
  );
};
