import { motion, AnimatePresence } from 'framer-motion';
import {
  HiAcademicCap, HiHome, HiBookOpen, HiCollection,
  HiCalendar, HiBell, HiLogout, HiChevronRight, HiClipboardCheck,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export type PageKey = 'dashboard' | 'courses' | 'materials' | 'schedule' | 'announcements' | 'attendance';

const NAV_ITEMS: {
  key: PageKey;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}[] = [
  { key: 'dashboard',     label: 'Dashboard',     icon: HiHome,           color: '#0d9488' },
  { key: 'courses',       label: 'Courses',        icon: HiBookOpen,       color: '#0891b2' },
  { key: 'materials',     label: 'Materials',      icon: HiCollection,     color: '#ec4899' },
  { key: 'schedule',      label: 'Schedule',       icon: HiCalendar,       color: '#10b981' },
  { key: 'attendance',    label: 'Attendance',     icon: HiClipboardCheck, color: '#f59e0b' },
  { key: 'announcements', label: 'Announcements',  icon: HiBell,           color: '#ef4444' },
];

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ activePage, onNavigate, onClose }: Omit<SidebarProps, 'isOpen'>) {
  const { user, logout } = useAuth();
  const { announcements } = useData();
  const unread = announcements.filter(a => !a.isRead).length;

  return (
    <div className="h-full flex flex-col py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
        >
          <HiAcademicCap className="text-white text-xl" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight" style={{ color: '#1a2e2a' }}>AUY Portal</span>
          <p className="text-[10px]" style={{ color: '#9ca3af' }}>Student Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#5eead4' }}>
          Navigation
        </p>
        {NAV_ITEMS.map(({ key, label, icon: Icon, color }) => {
          const isActive = activePage === key;
          return (
            <motion.button
              key={key}
              onClick={() => { onNavigate(key); onClose(); }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 relative group ${
                isActive
                  ? 'sidebar-item-active'
                  : 'hover:bg-teal-50'
              }`}
              style={{ color: isActive ? '#0d9488' : '#6b7280' }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: isActive ? `${color}22` : 'transparent',
                }}
              >
                <Icon
                  className="text-base flex-shrink-0 transition-colors"
                  style={{ color: isActive ? color : '#9ca3af' }}
                />
              </div>
              <span className="flex-1 text-left">{label}</span>
              {key === 'announcements' && unread > 0 && (
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold notif-pulse"
                  style={{ background: '#ef4444' }}
                >
                  {unread}
                </span>
              )}
              {isActive && (
                <HiChevronRight className="text-sm" style={{ color: '#14b8a6' }} />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Live sync status */}
      <div className="mb-4">
        <div
          className="rounded-2xl px-3 py-3 flex items-center gap-3"
          style={{ background: 'rgba(167,243,208,0.30)', border: '1px solid rgba(52,211,153,0.28)' }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 dot-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px]" style={{ color: '#6b7280' }}>Data Sync</p>
            <p className="text-[11px] font-semibold" style={{ color: '#059669' }}>Live · Updates every 60s</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div
        className="rounded-2xl p-3 flex items-center gap-3"
        style={{
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(20,184,166,0.14)',
          boxShadow: '0 2px 12px rgba(20,184,166,0.07)',
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
        >
          {user?.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: '#1a2e2a' }}>{user?.name}</p>
          <p className="text-[10px] truncate" style={{ color: '#9ca3af' }}>{user?.studentId}</p>
        </div>
        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-xl transition-colors hover:bg-red-50"
          style={{ color: '#d1d5db' }}
          title="Sign out"
        >
          <HiLogout className="text-base hover:text-red-400 transition-colors" />
        </motion.button>
      </div>
    </div>
  );
}

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderRight: '1px solid rgba(20,184,166,0.11)',
        }}
      >
        <SidebarContent activePage={activePage} onNavigate={onNavigate} onClose={() => {}} />
      </aside>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(13,148,136,0.12)', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(40px)',
              borderRight: '1px solid rgba(20,184,166,0.14)',
            }}
          >
            <SidebarContent activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
