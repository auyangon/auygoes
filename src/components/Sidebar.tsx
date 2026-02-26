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
    description: 'View enrolled courses'
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
    if (!name) return 'ST';
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
    <aside className="sidebar h-full w-64 flex flex-col">
      {/* University Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">AU</div>
          <div>
            <div className="logo-text">American University</div>
            <div className="logo-subtext">of Yangon</div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="student-card">
        <div className="flex items-center gap-3">
          <div className="student-avatar">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="student-name truncate">{displayName}</div>
            <div className="student-email truncate">{email}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-primary">Student</span>
              <span className="badge badge-secondary">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-section flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="nav-icon" size={18} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <ChevronRight size={14} className="opacity-50" />
                </div>
                <div className="nav-description">{item.description}</div>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="nav-item w-full text-left"
        >
          <LogOut size={18} className="nav-icon" />
          <div className="flex-1">
            <div>Logout</div>
            <div className="nav-description">End session</div>
          </div>
        </button>
      </div>
    </aside>
  );
};
