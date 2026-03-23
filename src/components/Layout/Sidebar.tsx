import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, FaBook, FaTrophy, FaCalendarCheck, 
  FaEnvelope, FaBell, FaUser, FaSignOutAlt,
  FaUniversity
} from 'react-icons/fa';
import { slideIn } from '../../utils/animations';
import { User } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  user: User | null;
}

const menuItems = [
  { id: 'dashboard', icon: FaHome, label: 'Dashboard', color: '#66c3b7' },
  { id: 'courses', icon: FaBook, label: 'Courses', color: '#2d9a8a' },
  { id: 'quests', icon: FaTrophy, label: 'Quests', color: '#f59e0b' },
  { id: 'attendance', icon: FaCalendarCheck, label: 'Attendance', color: '#10b981' },
  { id: 'requests', icon: FaEnvelope, label: 'Requests', color: '#8b5cf6' },
  { id: 'announcements', icon: FaBell, label: 'Announcements', color: '#ef4444' },
  { id: 'profile', icon: FaUser, label: 'Profile', color: '#06b6d4' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeSection, setActiveSection, user }) => {
  return (
    <motion.div
      {...slideIn}
      className="fixed left-0 top-0 h-screen z-50"
    >
      <div className={`h-full ${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#0a2e28] via-[#1b5f56] to-[#0a2e28] shadow-2xl border-r border-[#66c3b7]/20 transition-all duration-300`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-[#66c3b7]/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2d9a8a] to-[#1b5f56] flex items-center justify-center shadow-lg shadow-[#66c3b7]/30">
              <FaUniversity className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">AUY Portal</h1>
              <p className="text-[#66c3b7]/60 text-xs">Student Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Mini Profile */}
        {user && (
          <div className="p-4 mx-4 mt-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=50&h=50'} 
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-[#66c3b7]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <p className="text-[#66c3b7]/60 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="mt-6 px-4">
          <p className="text-[#66c3b7]/40 text-xs uppercase tracking-wider mb-4 px-3">
            Navigation
          </p>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-[#2d9a8a]/40 to-[#66c3b7]/40 text-white shadow-lg shadow-[#66c3b7]/20' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#66c3b7] rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-br from-[#2d9a8a] to-[#66c3b7] shadow-lg' 
                    : 'bg-white/10'
                }`}>
                  <item.icon className="text-lg" style={{ color: activeSection === item.id ? 'white' : item.color }} />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gradient-to-r from-[#2d9a8a]/30 to-[#66c3b7]/30 rounded-2xl p-4 mb-4 border border-[#66c3b7]/20">
            <p className="text-white text-sm font-medium mb-1">🌟 Premium Features</p>
            <p className="text-white/60 text-xs">Unlock all quests and boost your learning!</p>
          </div>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FaSignOutAlt className="text-lg" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
