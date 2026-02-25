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
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'My Courses', to: '/courses', icon: BookOpen },
  { name: 'Grades', to: '/grades', icon: GraduationCap },
  { name: 'Materials', to: '/materials', icon: FileText },
  { name: 'Progress', to: '/progress', icon: TrendingUp },
  { name: 'Calendar', to: '/calendar', icon: Calendar },
  { name: 'Announcements', to: '/announcements', icon: Bell },
  { name: 'Profile', to: '/profile', icon: User },
  { name: 'Settings', to: '/settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, user } = useAuth();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="h-full w-56 glass-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-seafoam-soft/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg glass-card flex items-center justify-center">
            <Award className="text-jet" size={20} />
          </div>
          <div>
            <h2 className="text-base font-normal text-jet">AUY Portal</h2>
            <p className="text-xs text-jet/60">American University</p>
          </div>
        </div>
      </div>

      {/* Student Info */}
      <div className="p-4 border-b border-seafoam-soft/20 glass-card m-3 rounded-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center">
            <User className="text-jet" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-normal text-jet truncate">
              {user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-jet/60 truncate">
              {user?.email || 'student@auy.edu.mm'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <div className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm',
                    isActive
                      ? 'glass-card text-jet'
                      : 'text-jet/70 hover:glass-card hover:text-jet'
                  )
                }
              >
                <Icon size={16} />
                <span className="font-normal">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-seafoam-soft/20">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-jet/70 hover:glass-card hover:text-jet transition-all text-sm"
        >
          <LogOut size={16} />
          <span className="font-normal">Logout</span>
        </button>
      </div>
    </aside>
  );
};
