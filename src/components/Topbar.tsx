import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell, HiSearch, HiRefresh, HiMenuAlt2, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { PageKey } from './Sidebar';

const PAGE_LABELS: Record<PageKey, string> = {
  dashboard:     'Dashboard',
  courses:       'My Courses',
  materials:     'Course Materials',
  schedule:      'Class Schedule',
  attendance:    'Attendance',
  announcements: 'Announcements',
};

interface TopbarProps {
  activePage: PageKey;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Topbar({ activePage, sidebarOpen, onToggleSidebar }: TopbarProps) {
  const { user } = useAuth();
  const { isLoading, lastUpdated, refetch, announcements } = useData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unread = announcements.filter(a => !a.isRead).length;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        background: 'rgba(255,255,255,0.84)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(20,184,166,0.10)',
        boxShadow: '0 1px 0 rgba(20,184,166,0.06)',
      }}
    >
      <div className="flex items-center gap-4 px-4 lg:px-6 h-16">
        {/* Hamburger (mobile) */}
        <motion.button
          onClick={onToggleSidebar}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden flex flex-col gap-1.5 p-2 rounded-xl transition-colors hover:bg-teal-50"
        >
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <HiX className="text-xl" style={{ color: '#6b7280' }} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <HiMenuAlt2 className="text-xl" style={{ color: '#6b7280' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.h1
              key={activePage}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-base lg:text-lg truncate"
              style={{ color: '#1a2e2a' }}
            >
              {PAGE_LABELS[activePage]}
            </motion.h1>
          </AnimatePresence>
          <p className="text-xs hidden sm:block" style={{ color: '#9ca3af' }}>{dateStr} · {timeStr}</p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search portal..."
                  className="input-glass w-full px-3 py-1.5 rounded-xl text-xs"
                  onBlur={() => { setSearchOpen(false); setSearchQuery(''); }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(p => !p)}
            className="p-2 rounded-xl hover:bg-teal-50 transition-colors"
            style={{ color: '#9ca3af' }}
          >
            <HiSearch className="text-lg" />
          </motion.button>

          {/* Refresh */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={refetch}
            disabled={isLoading}
            className="p-2 rounded-xl hover:bg-teal-50 transition-colors disabled:opacity-40"
            style={{ color: '#9ca3af' }}
            title={lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Refresh data'}
          >
            <motion.div animate={{ rotate: isLoading ? 360 : 0 }} transition={{ repeat: isLoading ? Infinity : 0, duration: 0.8, ease: 'linear' }}>
              <HiRefresh className="text-lg" />
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl hover:bg-teal-50 transition-colors"
              style={{ color: '#9ca3af' }}
            >
              <HiBell className="text-lg" />
            </motion.button>
            {unread > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center font-bold notif-pulse"
                style={{ background: '#ef4444', border: '2px solid #f0faf7' }}
              >
                {unread}
              </span>
            )}
          </div>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white cursor-pointer shadow-md"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
          >
            {user?.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
