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

  return (
    <aside className="sidebar-glass h-full w-64 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-seafoam-light/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-seafoam-medium/10 backdrop-blur-sm flex items-center justify-center border border-seafoam-light/30">
            <Award className="text-seafoam-dark" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-seafoam-deep leading-tight">AUY Portal</h2>
            <p className="text-xs text-seafoam-dark/70">American University</p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="p-4 border-b border-seafoam-light/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-seafoam-medium/10 backdrop-blur-sm flex items-center justify-center border border-seafoam-light/30">
            <User className="text-seafoam-dark" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-seafoam-deep truncate">
              {user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-seafoam-dark/60 truncate">
              {user?.email || 'student@auy.edu.mm'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <div className="flex-1">
                <span className="text-sm font-medium block">{item.name}</span>
                <span className="text-xs text-seafoam-dark/60">{item.description}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-seafoam-light/20">
        <button
          onClick={logout}
          className="sidebar-link w-full text-left"
        >
          <LogOut size={18} />
          <div className="flex-1">
            <span className="text-sm font-medium block">Logout</span>
            <span className="text-xs text-seafoam-dark/60">End session</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
