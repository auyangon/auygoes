import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaBell, FaSearch, FaUserCircle, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { User } from '../../types';
import { useStudentContext } from '../../context/StudentContext';

interface TopbarProps {
  user: User | null;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ user, sidebarOpen, toggleSidebar }) => {
  const { notifications, markNotificationRead } = useStudentContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleSidebar}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBars className="text-lg" />
            </motion.button>

            {/* Search Bar */}
            <motion.div 
              className={`relative transition-all duration-300 ${searchFocused ? 'w-80' : 'w-64'}`}
              animate={{ scale: searchFocused ? 1.02 : 1 }}
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                <input
                  type="text"
                  placeholder="Search courses, quests, materials..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#66c3b7]/50 focus:bg-white/15 transition-all duration-300"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaQuestionCircle className="text-lg" />
              </motion.button>
              <motion.button
                className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCog className="text-lg" />
              </motion.button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBell className="text-lg" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-80 bg-[#1b5f56]/95 backdrop-blur-2xl rounded-2xl border border-[#66c3b7]/30 shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-[#66c3b7]/20">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-4 border-b border-[#66c3b7]/10 cursor-pointer transition-all duration-200 ${
                            notif.read ? 'bg-white/5' : 'bg-[#66c3b7]/15'
                          } hover:bg-white/10`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              notif.type === 'reminder' ? 'bg-[#f59e0b]/30 text-[#f59e0b]' :
                              notif.type === 'academic' ? 'bg-[#66c3b7]/30 text-[#66c3b7]' :
                              'bg-[#8b5cf6]/30 text-[#8b5cf6]'
                            }`}>
                              <FaBell />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{notif.title}</p>
                              <p className="text-white/50 text-xs mt-1 truncate">{notif.message}</p>
                              <p className="text-white/30 text-xs mt-2">{notif.createdAt}</p>
                            </div>
                            {!notif.read && (
                              <div className="w-2.5 h-2.5 bg-[#66c3b7] rounded-full flex-shrink-0" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-[#66c3b7]/20">
                      <button className="w-full py-2 text-[#66c3b7] text-sm font-medium hover:text-white transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <motion.div 
              className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-[#66c3b7]"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2d9a8a] to-[#66c3b7] flex items-center justify-center">
                  <FaUserCircle className="text-white text-2xl" />
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-white font-semibold text-sm">{user?.name || 'Guest User'}</p>
                <p className="text-white/50 text-xs">{user?.role || 'Student'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
