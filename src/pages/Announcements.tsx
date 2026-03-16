import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell, HiExclamation, HiInformationCircle, HiCheckCircle } from 'react-icons/hi';
import { useData } from '../context/DataContext';
import type { Announcement } from '../context/DataContext';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

const PRIORITY_CONFIG = {
  high:   { icon: HiExclamation,       color: '#ef4444', bg: 'rgba(254,202,202,0.35)', border: 'rgba(248,113,113,0.30)', label: 'Urgent' },
  medium: { icon: HiInformationCircle, color: '#f59e0b', bg: 'rgba(253,230,138,0.30)', border: 'rgba(251,191,36,0.30)',  label: 'Important' },
  low:    { icon: HiCheckCircle,       color: '#10b981', bg: 'rgba(167,243,208,0.30)', border: 'rgba(52,211,153,0.30)',  label: 'Info' },
};

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  Academic:  { color: '#0d9488', bg: 'rgba(13,148,136,0.10)' },
  Campus:    { color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  Events:    { color: '#0891b2', bg: 'rgba(8,145,178,0.10)'  },
  Exam:      { color: '#ef4444', bg: 'rgba(239,68,68,0.10)'  },
  Financial: { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
};

function AnnouncementCard({ ann, onRead }: { ann: Announcement; onRead: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const pc = PRIORITY_CONFIG[ann.priority];
  const cc = CATEGORY_COLORS[ann.category] ?? { color: '#0d9488', bg: 'rgba(13,148,136,0.10)' };
  const PIcon = pc.icon;

  return (
    <motion.div
      variants={fadeUp}
      layout
      className="glass-card rounded-3xl overflow-hidden"
      style={!ann.isRead ? { borderLeft: `3px solid ${pc.color}` } : {}}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Priority icon */}
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: pc.bg, border: `1px solid ${pc.border}` }}>
            <PIcon className="text-lg" style={{ color: pc.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm leading-snug pr-2" style={{ color: '#1a2e2a' }}>
                {ann.title}
              </h3>
              {!ann.isRead && (
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#14b8a6' }} />
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: cc.bg, color: cc.color }}>
                {ann.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: pc.bg, color: pc.color }}>
                {pc.label}
              </span>
              <span className="text-[10px]" style={{ color: '#d1d5db' }}>·</span>
              <span className="text-[10px]" style={{ color: '#9ca3af' }}>{ann.author}</span>
              <span className="text-[10px]" style={{ color: '#d1d5db' }}>·</span>
              <span className="text-[10px]" style={{ color: '#9ca3af' }}>{ann.date}</span>
            </div>

            {/* Body */}
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm leading-relaxed mb-3 overflow-hidden"
                  style={{ color: '#4b5563' }}
                >
                  {ann.body}
                </motion.p>
              )}
            </AnimatePresence>
            {!expanded && (
              <p className="text-xs truncate mb-3" style={{ color: '#9ca3af' }}>{ann.body}</p>
            )}

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setExpanded(p => !p);
                  if (!ann.isRead) onRead(ann.id);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                style={{ background: 'rgba(20,184,166,0.09)', color: '#0d9488', border: '1px solid rgba(20,184,166,0.14)' }}
              >
                {expanded ? 'Show less' : 'Read more'}
              </motion.button>

              {!ann.isRead && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onRead(ann.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-xl transition-all"
                  style={{ color: '#9ca3af', border: '1px solid rgba(20,184,166,0.09)' }}
                >
                  Mark as read
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Announcements() {
  const { announcements, markAnnouncementRead, isLoading } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | Announcement['category']>('all');

  const categories: Announcement['category'][] = ['Academic', 'Campus', 'Events', 'Exam', 'Financial'];

  const filtered = announcements.filter(a => {
    if (filter === 'unread') return !a.isRead;
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const unread = announcements.filter(a => !a.isRead).length;

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
          style={{ background: 'rgba(167,243,208,0.40)' }} />
        <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)' }}>
                <HiBell className="text-base" style={{ color: '#ef4444' }} />
              </div>
              {unread > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: '#ef4444' }}>
                  {unread} unread
                </span>
              )}
            </div>
            <h1 className="font-bold text-2xl mb-1" style={{ color: '#1a2e2a' }}>Announcements</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Official notices from AUY departments</p>
          </div>

          {unread > 0 && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => announcements.filter(a => !a.isRead).forEach(a => markAnnouncementRead(a.id))}
              className="px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5"
              style={{ background: 'rgba(20,184,166,0.09)', color: '#0d9488', border: '1px solid rgba(20,184,166,0.16)' }}
            >
              <HiCheckCircle className="text-sm" />
              Mark all as read
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
        {([
          { key: 'all',    label: `All (${announcements.length})` },
          { key: 'unread', label: `Unread (${unread})` },
          ...categories.map(c => ({ key: c, label: c })),
        ] as { key: typeof filter; label: string }[]).map(({ key, label }) => (
          <motion.button
            key={key}
            onClick={() => setFilter(key)}
            whileTap={{ scale: 0.97 }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={
              filter === key
                ? { background: 'linear-gradient(135deg,#14b8a6,#0d9488)', color: '#fff', boxShadow: '0 4px 16px rgba(20,184,166,0.28)' }
                : { background: 'rgba(255,255,255,0.78)', color: '#6b7280', border: '1px solid rgba(20,184,166,0.12)' }
            }
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <HiBell className="text-4xl mx-auto mb-3" style={{ color: '#5eead4' }} />
          <p className="font-semibold" style={{ color: '#9ca3af' }}>No announcements found.</p>
        </div>
      ) : (
        <motion.div variants={stagger} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(ann => (
              <AnnouncementCard key={ann.id} ann={ann} onRead={markAnnouncementRead} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
