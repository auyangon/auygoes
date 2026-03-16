import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle, HiXCircle, HiClock, HiChevronDown, HiChevronUp,
  HiExclamation, HiTrendingUp, HiCalendar, HiClipboardCheck,
} from 'react-icons/hi';
import { useData } from '../context/DataContext';
import type { CourseAttendance, AttendanceRecord } from '../context/DataContext';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

// ─── Mini donut / ring via SVG ───────────────────────────────────────────────
function AttendanceRing({ pct }: { pct: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const ringColor = pct >= 85 ? '#10b981' : pct >= 75 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      {/* Track */}
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(20,184,166,0.10)" strokeWidth="10" />
      {/* Fill */}
      <circle
        cx="55" cy="55" r={r}
        fill="none"
        stroke={ringColor}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {/* Center text */}
      <text x="55" y="50" textAnchor="middle" fontSize="18" fontWeight="700" fill={ringColor}>{pct}%</text>
      <text x="55" y="66" textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">Attendance</text>
    </svg>
  );
}

// ─── Status tag ──────────────────────────────────────────────────────────────
function StatusTag({ status }: { status: 'present' | 'absent' | 'late' }) {
  const map = {
    present: { label: 'Present', bg: 'rgba(167,243,208,0.35)', color: '#047857', border: 'rgba(52,211,153,0.30)', icon: HiCheckCircle },
    absent:  { label: 'Absent',  bg: 'rgba(254,202,202,0.35)', color: '#dc2626', border: 'rgba(248,113,113,0.30)', icon: HiXCircle },
    late:    { label: 'Late',    bg: 'rgba(253,230,138,0.35)', color: '#b45309', border: 'rgba(251,191,36,0.30)',  icon: HiClock },
  };
  const { label, bg, color, border, icon: Icon } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: bg, color, border: `1px solid ${border}` }}
    >
      <Icon className="text-xs" />
      {label}
    </span>
  );
}

// ─── Warning banner ───────────────────────────────────────────────────────────
function WarningBanner({ course }: { course: CourseAttendance }) {
  if (course.percentage >= 75) return null;
  return (
    <div
      className="flex items-start gap-2 px-3 py-2 rounded-xl mt-3 text-xs font-medium"
      style={{ background: 'rgba(254,202,202,0.30)', border: '1px solid rgba(248,113,113,0.25)', color: '#dc2626' }}
    >
      <HiExclamation className="text-sm flex-shrink-0 mt-0.5" />
      <span>
        Attendance below 75%. You need{' '}
        <strong>{Math.ceil((0.75 * course.totalClasses - course.present) / 0.25)}</strong> more consecutive classes to meet the requirement.
      </span>
    </div>
  );
}

// ─── Record calendar mini-grid ────────────────────────────────────────────────
function RecordGrid({ records }: { records: AttendanceRecord[] }) {
  const colorMap = {
    present: 'cal-day-present',
    absent:  'cal-day-absent',
    late:    'cal-day-late',
  };

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {records.map((r, i) => (
        <div key={i} title={`${r.date} — ${r.status}`} className={`w-6 h-6 rounded-md text-[8px] font-bold flex items-center justify-center ${colorMap[r.status]}`}>
          {new Date(r.date).getDate()}
        </div>
      ))}
    </div>
  );
}

// ─── Course card ─────────────────────────────────────────────────────────────
function CourseAttendanceCard({ ca, index }: { ca: CourseAttendance; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pct = ca.percentage;
  const status = pct >= 85 ? 'excellent' : pct >= 75 ? 'ok' : 'warning';

  const statusStyle = {
    excellent: { label: 'Excellent',    bg: 'rgba(167,243,208,0.25)', color: '#047857', border: 'rgba(52,211,153,0.25)' },
    ok:        { label: 'Satisfactory', bg: 'rgba(253,230,138,0.25)', color: '#b45309', border: 'rgba(251,191,36,0.25)' },
    warning:   { label: 'At Risk',      bg: 'rgba(254,202,202,0.25)', color: '#dc2626', border: 'rgba(248,113,113,0.25)' },
  }[status];

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass-card rounded-3xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Ring */}
          <div className="flex-shrink-0">
            <AttendanceRing pct={pct} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span
                  className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1"
                  style={{ background: `${ca.color}18`, color: ca.color }}
                >
                  {ca.courseCode}
                </span>
                <h3 className="font-semibold text-sm leading-tight" style={{ color: '#1a2e2a' }}>
                  {ca.courseName}
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{ca.instructor}</p>
              </div>
              <span
                className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
              >
                {statusStyle.label}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 mt-3 flex-wrap">
              {[
                { label: 'Total',   value: ca.totalClasses, color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
                { label: 'Present', value: ca.present,      color: '#10b981', bg: 'rgba(16,185,129,0.10)'  },
                { label: 'Absent',  value: ca.absent,       color: '#ef4444', bg: 'rgba(239,68,68,0.10)'   },
                { label: 'Late',    value: ca.late,         color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
              ].map(({ label, value, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center px-3 py-1.5 rounded-xl"
                  style={{ background: bg }}
                >
                  <span className="text-base font-bold" style={{ color }}>{value}</span>
                  <span className="text-[9px] font-medium" style={{ color: '#9ca3af' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="progress-track h-1.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 85
                      ? 'linear-gradient(90deg,#6ee7b7,#10b981)'
                      : pct >= 75
                      ? 'linear-gradient(90deg,#fde68a,#f59e0b)'
                      : 'linear-gradient(90deg,#fca5a5,#ef4444)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[9px]" style={{ color: '#d1d5db' }}>
                <span>0%</span>
                <span className="font-medium" style={{ color: '#9ca3af' }}>75% required</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <WarningBanner course={ca} />

        {/* Expand toggle */}
        <motion.button
          onClick={() => setExpanded(p => !p)}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-2xl text-xs font-medium transition-colors hover:bg-teal-50"
          style={{ color: '#0d9488', border: '1px solid rgba(20,184,166,0.14)' }}
        >
          {expanded ? <HiChevronUp /> : <HiChevronDown />}
          {expanded ? 'Hide' : 'Show'} attendance history
        </motion.button>
      </div>

      {/* Record grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 pt-2"
              style={{ borderTop: '1px solid rgba(20,184,166,0.09)', background: 'rgba(240,250,247,0.55)' }}
            >
              <p className="text-[11px] font-semibold mb-2" style={{ color: '#9ca3af' }}>
                CLASS HISTORY — {ca.records.length} sessions
              </p>
              <div className="flex gap-4 mb-3">
                {[
                  { label: 'Present', cls: 'cal-day-present' },
                  { label: 'Absent',  cls: 'cal-day-absent'  },
                  { label: 'Late',    cls: 'cal-day-late'    },
                ].map(({ label, cls }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-md ${cls}`} />
                    <span className="text-[10px]" style={{ color: '#9ca3af' }}>{label}</span>
                  </div>
                ))}
              </div>
              <RecordGrid records={ca.records} />

              {/* Table of recent records */}
              <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {[...ca.records].reverse().slice(0, 10).map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.72)' }}
                  >
                    <div className="flex items-center gap-2">
                      <HiCalendar className="text-xs" style={{ color: '#5eead4' }} />
                      <span className="text-xs" style={{ color: '#4b5563' }}>
                        {new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <StatusTag status={r.status} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Summary stat card ────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, color, bg, icon: Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; bg: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}) {
  return (
    <motion.div variants={fadeUp} className="glass-card rounded-3xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="text-xl" style={{ color }} />
        </div>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color: '#1a2e2a' }}>{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: '#9ca3af' }}>{sub}</p>}
    </motion.div>
  );
}

// ─── Main Attendance Page ─────────────────────────────────────────────────────
export default function Attendance() {
  const { attendance } = useData();
  const [filter, setFilter] = useState<'all' | 'at-risk' | 'excellent'>('all');

  const totalClasses = attendance.reduce((s, c) => s + c.totalClasses, 0);
  const totalPresent = attendance.reduce((s, c) => s + c.present, 0);
  const totalAbsent  = attendance.reduce((s, c) => s + c.absent, 0);
  const totalLate    = attendance.reduce((s, c) => s + c.late, 0);
  const overallPct   = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const atRisk       = attendance.filter(c => c.percentage < 75).length;

  const filtered = attendance.filter(c => {
    if (filter === 'at-risk')   return c.percentage < 75;
    if (filter === 'excellent') return c.percentage >= 85;
    return true;
  });

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px]"
            style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.40), transparent)' }} />
          <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full blur-[60px]"
            style={{ background: 'radial-gradient(circle, rgba(204,251,241,0.35), transparent)' }} />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(167,243,208,0.35)' }}>
                <HiClipboardCheck className="text-lg" style={{ color: '#10b981' }} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{ background: 'rgba(167,243,208,0.25)', color: '#047857' }}>
                Semester 2, AY 2023–2024
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1a2e2a' }}>
              Attendance Overview
            </h2>
            <p className="text-sm" style={{ color: '#9ca3af' }}>
              Track your class attendance across all enrolled courses.
            </p>
          </div>

          {/* Overall ring */}
          <div className="flex items-center gap-4 glass-strong rounded-2xl px-5 py-4">
            <svg width="70" height="70" viewBox="0 0 70 70">
              <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(20,184,166,0.10)" strokeWidth="7" />
              <circle
                cx="35" cy="35" r="28"
                fill="none"
                stroke={overallPct >= 85 ? '#10b981' : overallPct >= 75 ? '#f59e0b' : '#ef4444'}
                strokeWidth="7"
                strokeDasharray={`${(overallPct / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                strokeDashoffset={2 * Math.PI * 28 / 4}
                strokeLinecap="round"
              />
              <text x="35" y="39" textAnchor="middle" fontSize="13" fontWeight="800"
                fill={overallPct >= 85 ? '#10b981' : overallPct >= 75 ? '#f59e0b' : '#ef4444'}>
                {overallPct}%
              </text>
            </svg>
            <div>
              <p className="text-xs font-semibold" style={{ color: '#9ca3af' }}>Overall</p>
              <p className="text-lg font-bold" style={{ color: '#1a2e2a' }}>
                {overallPct >= 85 ? 'Excellent' : overallPct >= 75 ? 'Satisfactory' : 'At Risk'}
              </p>
              {atRisk > 0 && (
                <p className="text-[11px] mt-0.5" style={{ color: '#ef4444' }}>
                  {atRisk} course{atRisk > 1 ? 's' : ''} at risk
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Summary stats ── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Classes" value={totalClasses} sub="Across all courses"
          color="#0d9488" bg="rgba(13,148,136,0.10)" icon={HiCalendar} />
        <SummaryCard label="Present" value={totalPresent} sub={`${overallPct}% attendance rate`}
          color="#10b981" bg="rgba(16,185,129,0.12)" icon={HiCheckCircle} />
        <SummaryCard label="Absent" value={totalAbsent} sub="Classes missed"
          color="#ef4444" bg="rgba(239,68,68,0.10)" icon={HiXCircle} />
        <SummaryCard label="Late" value={totalLate} sub="Counted as half-present"
          color="#f59e0b" bg="rgba(245,158,11,0.10)" icon={HiClock} />
      </motion.div>

      {/* ── At-risk alert ── */}
      {atRisk > 0 && (
        <motion.div
          variants={fadeUp}
          className="flex items-start gap-3 px-5 py-4 rounded-2xl"
          style={{
            background: 'rgba(254,202,202,0.25)',
            border: '1.5px solid rgba(248,113,113,0.28)',
          }}
        >
          <HiExclamation className="text-xl flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: '#dc2626' }}>
              Attendance Warning — {atRisk} Course{atRisk > 1 ? 's' : ''} Below 75%
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#f87171' }}>
              AUY requires a minimum of 75% attendance to sit for exams. Please attend all upcoming classes.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Filter tabs ── */}
      <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
        {([
          { key: 'all',       label: `All Courses (${attendance.length})`                              },
          { key: 'at-risk',   label: `At Risk (${attendance.filter(c => c.percentage < 75).length})`  },
          { key: 'excellent', label: `Excellent (${attendance.filter(c => c.percentage >= 85).length})` },
        ] as { key: typeof filter; label: string }[]).map(({ key, label }) => (
          <motion.button
            key={key}
            onClick={() => setFilter(key)}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200"
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

      {/* ── Course cards ── */}
      <motion.div variants={stagger} className="space-y-4">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-10 text-center"
            >
              <HiTrendingUp className="text-4xl mx-auto mb-3" style={{ color: '#5eead4' }} />
              <p className="font-semibold" style={{ color: '#6b7280' }}>No courses match this filter.</p>
            </motion.div>
          ) : (
            filtered.map((ca, i) => (
              <CourseAttendanceCard key={ca.courseId} ca={ca} index={i} />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Policy note ── */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-2xl px-5 py-4 flex items-start gap-3"
      >
        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(20,184,166,0.10)' }}>
          <HiClipboardCheck className="text-base" style={{ color: '#14b8a6' }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: '#1a2e2a' }}>AUY Attendance Policy</p>
          <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#9ca3af' }}>
            Students must maintain a minimum of <strong style={{ color: '#0d9488' }}>75% attendance</strong> in each course to be eligible for the final examination.
            Late arrivals (more than 10 minutes) count as <strong style={{ color: '#f59e0b' }}>half a session</strong>. Appeals must be submitted to the Academic Registrar within 7 days.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
