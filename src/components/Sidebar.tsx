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
  Award,
  Clock
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
    description: 'Latest updates',
    badge: 3
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
    <aside className="h-full w-64 bg-gradient-to-b from-emerald-900/95 to-teal-900/95 backdrop-blur-xl border-r border-emerald-500/20 flex flex-col">
      {/* University Logo & Name */}
      <div className="p-6 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
            <Award className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">AUY Portal</h2>
            <p className="text-xs text-emerald-400/80">American University</p>
          </div>
        </div>
      </div>

      {/* Student Info Summary */}
      <div className="p-4 border-b border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-emerald-400/60 truncate">
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border-l-2 border-emerald-400'
                      : 'text-emerald-100/70 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-emerald-400/70 group-hover:text-emerald-400'} />
                    <div className="flex-1">
                      <span className="text-sm font-medium block">{item.name}</span>
                      <span className="text-[10px] text-emerald-400/50 group-hover:text-emerald-400/70">
                        {item.description}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-500/20 text-emerald-300 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-emerald-500/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all group"
        >
          <LogOut size={18} className="text-emerald-400/70 group-hover:text-emerald-400" />
          <div className="flex-1 text-left">
            <span className="text-sm font-medium block">Logout</span>
            <span className="text-[10px] text-emerald-400/50">End session</span>
          </div>
        </button>
        
        {/* Version info */}
        <p className="text-[10px] text-emerald-400/30 text-center mt-3">
          AUY Student Portal v1.0
        </p>
      </div>
    </aside>
  );
};
