import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock, HiLocationMarker, HiCalendar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useData } from '../context/DataContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri'
};

const TYPE_COLORS: Record<string, string> = {
  Lecture: '#0d9488', Lab: '#10b981', Tutorial: '#0891b2', Exam: '#ef4444'
};
const TYPE_BG: Record<string, string> = {
  Lecture: 'rgba(13,148,136,0.12)', Lab: 'rgba(16,185,129,0.12)',
  Tutorial: 'rgba(8,145,178,0.12)', Exam: 'rgba(239,68,68,0.12)'
};

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

export default function Schedule() {
  const { schedule, isLoading } = useData();
  const [activeDay, setActiveDay] = useState<string>(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return DAYS.includes(today) ? today : 'Monday';
  });

  const todayClasses = schedule
    .filter(s => s.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getDateForDay = (day: string) => {
    const today = new Date();
    const todayIdx = today.getDay();
    const targetIdx = DAYS.indexOf(day) + 1;
    const diff = targetIdx - todayIdx;
    const d = new Date(today);
    d.setDate(today.getDate() + diff);
    return d;
  };

  const prevDay = () => { const i = DAYS.indexOf(activeDay); if (i > 0) setActiveDay(DAYS[i - 1]); };
  const nextDay = () => { const i = DAYS.indexOf(activeDay); if (i < DAYS.length - 1) setActiveDay(DAYS[i + 1]); };

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);

  const getTopPct    = (t: string) => { const [h, m] = t.split(':').map(Number); return ((h - 8) * 60 + m) / 600 * 100; };
  const getHeightPct = (s: string, e: string) => {
    const [sh, sm] = s.split(':').map(Number);
    const [eh, em] = e.split(':').map(Number);
    return ((eh * 60 + em) - (sh * 60 + sm)) / 600 * 100;
  };

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
                style={{ background: 'rgba(16,185,129,0.12)' }}>
                <HiCalendar className="text-base" style={{ color: '#10b981' }} />
              </div>
            </div>
            <h1 className="font-bold text-2xl mb-1" style={{ color: '#1a2e2a' }}>Weekly Schedule</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Semester 2, AY 2023–2024</p>
          </div>

          {/* Day nav */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prevDay} whileTap={{ scale: 0.9 }}
              disabled={DAYS.indexOf(activeDay) === 0}
              className="p-2 rounded-xl transition-colors hover:bg-teal-50 disabled:opacity-30"
              style={{ color: '#0d9488', border: '1px solid rgba(20,184,166,0.18)' }}
            >
              <HiChevronLeft />
            </motion.button>
            <div className="text-center px-3">
              <p className="font-bold text-base" style={{ color: '#1a2e2a' }}>{activeDay}</p>
              <p className="text-[11px]" style={{ color: '#9ca3af' }}>
                {getDateForDay(activeDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <motion.button
              onClick={nextDay} whileTap={{ scale: 0.9 }}
              disabled={DAYS.indexOf(activeDay) === DAYS.length - 1}
              className="p-2 rounded-xl transition-colors hover:bg-teal-50 disabled:opacity-30"
              style={{ color: '#0d9488', border: '1px solid rgba(20,184,166,0.18)' }}
            >
              <HiChevronRight />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Day tabs */}
      <motion.div variants={fadeUp}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DAYS.map(day => {
          const isToday = day === todayName;
          const isActive = day === activeDay;
          const classCount = schedule.filter(s => s.day === day).length;
          const d = getDateForDay(day);
          return (
            <motion.button
              key={day}
              onClick={() => setActiveDay(day)}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 min-w-[72px]"
              style={
                isActive
                  ? { background: 'linear-gradient(135deg,#14b8a6,#0d9488)', color: '#fff', boxShadow: '0 4px 16px rgba(20,184,166,0.28)' }
                  : { background: 'rgba(255,255,255,0.78)', color: '#6b7280', border: '1px solid rgba(20,184,166,0.12)' }
              }
            >
              <span className="text-[10px] font-bold">{DAY_ABBR[day]}</span>
              <span className="text-base font-bold">{d.getDate()}</span>
              {classCount > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array(Math.min(classCount, 3)).fill(0).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full"
                      style={{ background: isActive ? 'rgba(255,255,255,0.7)' : '#5eead4' }} />
                  ))}
                </div>
              )}
              {isToday && !isActive && (
                <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: '#10b981' }} />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Two-column: list + timeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Class list */}
        <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm" style={{ color: '#1a2e2a' }}>
              {activeDay === todayName ? "Today's" : activeDay + "'s"} Classes
            </h2>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(20,184,166,0.10)', color: '#0d9488' }}>
              {todayClasses.length} session{todayClasses.length !== 1 ? 's' : ''}
            </span>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="text-center py-10">
              <HiCalendar className="text-3xl mx-auto mb-2" style={{ color: '#5eead4' }} />
              <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>No classes on {activeDay}</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                {todayClasses.map((cls, i) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(20,184,166,0.08)' }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Color bar */}
                      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: cls.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm truncate" style={{ color: '#1a2e2a' }}>{cls.courseName}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{cls.instructor}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0"
                            style={{ background: TYPE_BG[cls.type], color: TYPE_COLORS[cls.type] }}>
                            {cls.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-[11px]" style={{ color: '#9ca3af' }}>
                            <HiClock className="text-xs" />
                            <span>{cls.startTime}–{cls.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px]" style={{ color: '#9ca3af' }}>
                            <HiLocationMarker className="text-xs" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Timeline */}
        <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
          <h2 className="font-semibold text-sm mb-5" style={{ color: '#1a2e2a' }}>Timeline View</h2>
          <div className="relative" style={{ height: '400px' }}>
            {/* Hour lines */}
            {hours.map(h => (
              <div key={h}
                className="absolute left-12 right-0 border-t flex items-center"
                style={{
                  top: `${((h - 8) / 10) * 100}%`,
                  borderColor: 'rgba(20,184,166,0.09)',
                }}
              >
                <span className="absolute -left-12 text-[10px] -translate-y-1/2 font-medium"
                  style={{ color: '#d1d5db' }}>
                  {h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`}
                </span>
              </div>
            ))}

            {/* Events */}
            {todayClasses.map(cls => {
              const top = getTopPct(cls.startTime);
              const height = getHeightPct(cls.startTime, cls.endTime);
              return (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, scaleY: 0.8 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-14 right-2 rounded-2xl p-3 overflow-hidden"
                  style={{
                    top: `${top}%`,
                    height: `${Math.max(height, 8)}%`,
                    background: `${cls.color}14`,
                    border: `1.5px solid ${cls.color}30`,
                    borderLeft: `3px solid ${cls.color}`,
                  }}
                >
                  <p className="font-semibold text-[11px] truncate" style={{ color: '#1a2e2a' }}>{cls.courseName}</p>
                  {height > 5 && (
                    <p className="text-[9px] mt-0.5 truncate" style={{ color: '#9ca3af' }}>
                      {cls.startTime}–{cls.endTime} · {cls.room}
                    </p>
                  )}
                </motion.div>
              );
            })}

            {/* Now line */}
            {activeDay === todayName && (() => {
              const now = new Date();
              const pct = ((now.getHours() - 8) * 60 + now.getMinutes()) / 600 * 100;
              if (pct < 0 || pct > 100) return null;
              return (
                <div className="absolute left-12 right-0 flex items-center" style={{ top: `${pct}%` }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#ef4444' }} />
                  <div className="flex-1 border-t" style={{ borderColor: '#ef4444', opacity: 0.5 }} />
                </div>
              );
            })()}
          </div>
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div variants={fadeUp}
        className="glass-card rounded-2xl px-5 py-4 flex items-center gap-6 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Legend:</span>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color, opacity: 0.75 }} />
            <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{type}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
