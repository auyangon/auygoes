// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Award, 
  LogOut,
  Bell,
  GraduationCap,
  X,
  User
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
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-emerald-500 to-teal-500' },
    { path: '/profile', icon: User, label: 'My Profile', color: 'from-purple-500 to-pink-500' },
    { path: '/exams', icon: GraduationCap, label: 'Exam Portal', color: 'from-blue-500 to-indigo-500' },
    { path: '/announcements', icon: Bell, label: 'Announcements', color: 'from-amber-500 to-orange-500' },
    { path: '/courses', icon: BookOpen, label: 'My Courses', color: 'from-rose-500 to-red-500' },
    { path: '/materials', icon: FileText, label: 'Materials', color: 'from-cyan-500 to-blue-500' },
    { path: '/progress', icon: Award, label: 'Progress', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="h-full w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/40 flex flex-col animate-fadeIn">
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-[#0B4F3A] z-10 transition-all duration-300 hover:rotate-90"
        >
          <X size={20} />
        </button>
      )}

      <div className="p-6 border-b border-white/30 animate-slideDown">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] rounded-xl shadow-lg animate-pulse">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] bg-clip-text text-transparent">
              AUY Portal
            </h1>
            <p className="text-xs text-gray-500/80 mt-0.5">
              American University
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li 
              key={item.path}
              className="animate-slideRight"
              style={ { animationDelay: `${index * 0.1}s` } }
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-600 hover:text-[#0B4F3A]'
                  }`
                }
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  ({ isActive }) => isActive ? 'opacity-100' : ''
                }`} />
                
                <div className={`absolute left-0 w-1 h-8 bg-gradient-to-b ${item.color} rounded-r-full transition-all duration-300 ${
                  ({ isActive }) => isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} />
                
                <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                  ({ isActive }) => isActive ? 'text-white' : ''
                }`}>
                  <item.icon size={20} />
                </div>
                
                <span className="relative z-10 font-medium">{item.label}</span>
                
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/30 animate-slideUp">
        <button
          onClick={handleLogout}
          className="group relative flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:text-red-500 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <LogOut size={20} />
          </div>
          <span className="relative z-10 font-medium">Logout</span>
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
        </button>
      </div>

      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-[#0B4F3A]/10 to-[#1a6b4f]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
    </div>
  );
};
