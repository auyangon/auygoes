import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  Bell,
  User,
  Settings,
  LogOut,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  {
    name: 'Academic Overview',
    to: '/',
    icon: LayoutDashboard,
    description: 'Dashboard'
  },
  {
    name: 'My Courses',
    to: '/courses',
    icon: BookOpen,
    description: 'Attendance, courses & grades'
  },
  {
    name: 'My Exams',
    to: '/exams',
    icon: Calendar,
    description: 'Timetable and exams'
  },
  {
    name: 'Grades',
    to: '/grades',
    icon: GraduationCap,
    description: 'Academic performance'
  },
  {
    name: 'Announcements',
    to: '/announcements',
    icon: Bell,
    description: 'Latest updates'
  },
  {
    name: 'Profile',
    to: '/profile',
    icon: User,
    description: 'Your information'
  },
  {
    name: 'Settings',
    to: '/settings',
    icon: Settings,
    description: 'Preferences'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, user } = useAuth();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const getClassName = (isActive: boolean) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left";
    return isActive 
      ? baseClasses + " bg-pastel-blue text-white"
      : baseClasses + " text-gray-600 hover:bg-pastel-pink hover:text-gray-700";
  };

  return (
    <aside className="h-full w-64 bg-gradient-to-b from-white to-pastel-peach border-r border-pastel-peach flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-pastel-peach">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pastel-blue flex items-center justify-center">
            <Award className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-700 leading-tight">AUY Portal</h2>
            <p className="text-xs text-gray-500">American University</p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="p-4 border-b border-pastel-peach bg-pastel-yellow/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pastel-purple flex items-center justify-center">
            <User className="text-gray-700" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">
              {user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'student@auy.edu.mm'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) => getClassName(isActive)}
              >
                <Icon size={18} />
                <div className="flex-1">
                  <span className="text-sm font-medium block">{item.name}</span>
                  <span className="text-xs text-gray-500">{item.description}</span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-pastel-peach">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-pastel-rose hover:text-gray-700 transition-all w-full text-left"
        >
          <LogOut size={18} />
          <div className="flex-1">
            <span className="text-sm font-medium block">Logout</span>
            <span className="text-xs text-gray-500">End session</span>
          </div>
        </button>
      </div>
    </aside>
  );
};