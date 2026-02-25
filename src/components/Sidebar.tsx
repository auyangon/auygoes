import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  TrendingUp,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from './Common';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/grades', icon: GraduationCap, label: 'Grades' },
    { path: '/materials', icon: FileText, label: 'Materials' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
  ];

  return (
    <GlassCard className="h-full w-64 rounded-none p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">AUY Portal</h2>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all mt-auto"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </GlassCard>
  );
};