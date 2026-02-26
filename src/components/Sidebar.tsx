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
  Award,
  ChevronRight
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
    description: 'Dashboard & analytics'
  },
  {
    name: 'My Courses',
    to: '/courses',
    icon: BookOpen,
    description: 'Enrolled courses'
  },
  {
    name: 'My Exams',
    to: '/exams',
    icon: Calendar,
    description: 'Exam schedule'
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
    description: 'University updates'
  },
  {
    name: 'Profile',
    to: '/profile',
    icon: User,
    description: 'Personal information'
  },
  {
    name: 'Settings',
    to: '/settings',
    icon: Settings,
    description: 'Account preferences'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, user } = useAuth();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.displayName || 'Student User';
  const initials = getInitials(displayName);
  const email = user?.email || 'student@auy.edu.mm';

  return (
    <aside className="uni-sidebar h-full w-64 flex flex-col">
      {/* University Logo */}
      <div className="uni-sidebar-header">
        <div className="uni-logo">
          <div className="uni-logo-icon">AU</div>
          <div>
            <div className="uni-logo-text">American University</div>
            <div className="uni-logo-subtext">of Yangon</div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="uni-student-card">
        <div className="flex items-center gap-3">
          <div className="uni-student-avatar">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 text-sm truncate">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">
              {email}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="uni-badge uni-badge-primary">Student</span>
              <span className="uni-badge">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="uni-nav flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `uni-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="uni-nav-icon" size={18} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <ChevronRight size={14} className="opacity-50" />
                </div>
                <div className="uni-nav-description">{item.description}</div>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="uni-nav-item w-full text-left"
        >
          <LogOut size={18} className="uni-nav-icon" />
          <div className="flex-1">
            <div>Logout</div>
            <div className="uni-nav-description">End session</div>
          </div>
        </button>
      </div>
    </aside>
  );
};
