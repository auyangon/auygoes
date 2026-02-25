import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { 
    name: 'Dashboard', 
    to: '/', 
    icon: LayoutDashboard,
    description: 'Overview'
  },
  { 
    name: 'My Courses', 
    to: '/courses', 
    icon: BookOpen,
    description: 'Current enrollment'
  },
  { 
    name: 'Grades', 
    to: '/grades', 
    icon: GraduationCap,
    description: 'Academic performance'
  },
  { 
    name: 'Materials', 
    to: '/materials', 
    icon: FileText,
    description: 'Lecture notes & resources'
  },
  { 
    name: 'Progress', 
    to: '/progress', 
    icon: TrendingUp,
    description: 'Track your journey'
  },
  { 
    name: 'Calendar', 
    to: '/calendar', 
    icon: Calendar,
    description: 'Academic schedule'
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

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
  };

  return (
    <aside className="h-full w-64 glass-sidebar flex flex-col">
      {/* University Logo & Name */}
      <div className="p-6 border-b border-seafoam-soft/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-dark flex items-center justify-center">
            <Award className="text-jet" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-jet leading-tight">AUY Portal</h2>
            <p className="text-xs text-jet/70">American University</p>
          </div>
        </div>
      </div>

      {/* Student Info Summary */}
      <div className="p-4 border-b border-seafoam-soft/30 glass-dark/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full glass-dark flex items-center justify-center">
            <User className="text-jet" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-jet truncate">
              {user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-jet/60 truncate">
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
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all group',
                    isActive
                      ? 'glass-dark text-jet font-medium'
                      : 'text-jet/70 hover:glass-light hover:text-jet'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-jet' : 'text-jet/60 group-hover:text-jet'} />
                    <div className="flex-1">
                      <span className="text-sm font-medium block">{item.name}</span>
                      <span className="text-[10px] text-jet/50 group-hover:text-jet/70">
                        {item.description}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-seafoam-soft/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-jet/70 hover:glass-light hover:text-jet transition-all group"
        >
          <LogOut size={18} className="text-jet/60 group-hover:text-jet" />
          <div className="flex-1 text-left">
            <span className="text-sm font-medium block">Logout</span>
            <span className="text-[10px] text-jet/50">End session</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
