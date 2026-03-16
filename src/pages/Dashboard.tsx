import { motion } from 'framer-motion';
import {
  HiAcademicCap, HiBookOpen, HiCheckCircle,
  HiTrendingUp, HiClock, HiBell, HiStar, HiChevronRight, HiClipboardCheck,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

function StatCard({ icon: Icon, label, value, sub, color, bg, delay = 0 }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string | number; sub?: string;
  color: string; bg: string; delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay, duration: 0.4 }}
      className="glass-card stat-card rounded-3xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="text-xl" style={{ color }} />
        </div>
        <span className="text-[10px] font-medium px-2 py-1 rounded-lg"
          style={{ background: 'rgba(20,184,166,0.08)', color: '#9ca3af' }}>
          {sub || 'This Semester'}
        </span>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color: '#1a2e2a' }}>{value}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, schedule, announcements, attendance, isLoading } = useData();

  const unread = announcements.filter(a => !a.isRead).length;
  const creditsPercent = Math.round(((user?.credits ?? 0) / (user?.totalCredits ?? 120)) * 100);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = schedule.filter(s => s.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const recentAnn = [...announcements].slice(0, 3);

  const overallAtt = attendance.length > 0
    ? Math.round(attendance.reduce((s, c) => s + c.percentage, 0) / attendance.length)
    : 0;
  const atRisk = attendance.filter(c => c.percentage < 75).length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const priorityColors: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
  const priorityBg: Record<string, string> = {
    high: 'rgba(254,202,202,0.35)',
    medium: 'rgba(253,230,138,0.30)',
    low: 'rgba(167,243,208,0.30)',
  };

  const gpa = courses.length
    ? (courses.reduce((s, c) => s + c.gradePoints * c.credits, 0) / courses.reduce((s, c) => s + c.credits, 0)).toFixed(2)
    : '—';

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* ── Hero Welcome ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[90px]"
            style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.40), transparent)' }} />
          <div className="absolute -bottom-8 left-1/3 w-56 h-56 rounded-full blur-[70px]"
            style={{ background: 'radial-gradient(circle, rgba(204,251,241,0.35), transparent)' }} />
        </div>
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#14b8a6' }}>{getGreeting()} 👋</p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1a2e2a' }}>
                {user?.name?.split(' ')[0]}
              </h2>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                {user?.major} · {user?.year} · {user?.studentId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-2xl text-xs font-semibold"
                style={{ background: 'rgba(20,184,166,0.10)', color: '#0d9488', border: '1px solid rgba(20,184,166,0.18)' }}
              >
                Semester 2, AY 2023–24
              </div>
            </div>
          </div>

          {/* Credit progress */}
          <div className="mt-6 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(20,184,166,0.10)' }}>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold" style={{ color: '#4b5563' }}>Degree Progress</span>
              <span className="font-bold" style={{ color: '#0d9488' }}>{user?.credits} / {user?.totalCredits} credits</span>
            </div>
            <div className="progress-track h-2.5">
              <motion.div
                className="progress-fill h-full"
                initial={{ width: 0 }}
                animate={{ width: `${creditsPercent}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <p className="text-[10px] mt-1.5" style={{ color: '#9ca3af' }}>{creditsPercent}% complete toward {user?.totalCredits}-credit graduation requirement</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats grid ── */}
      <motion.div variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiBookOpen}       label="Enrolled Courses"  value={courses.length}       color="#0d9488" bg="rgba(13,148,136,0.10)"  delay={0} />
        <StatCard icon={HiStar}           label="Current GPA"       value={gpa}                  color="#0891b2" bg="rgba(8,145,178,0.10)"   delay={0.05} sub="Cumulative" />
        <StatCard icon={HiClipboardCheck} label="Avg. Attendance"   value={`${overallAtt}%`}     color="#10b981" bg="rgba(16,185,129,0.10)"  delay={0.10} sub={atRisk > 0 ? `${atRisk} at risk` : 'All good'} />
        <StatCard icon={HiAcademicCap}    label="Total Credits"     value={user?.credits ?? 0}   color="#f59e0b" bg="rgba(245,158,11,0.10)"  delay={0.15} />
      </motion.div>

      {/* ── Two-column area ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)' }}>
                <HiClock className="text-base" style={{ color: '#10b981' }} />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: '#1a2e2a' }}>Today — {today}</h3>
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.10)', color: '#047857' }}>
              {todayClasses.length} class{todayClasses.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="text-center py-8">
              <HiCheckCircle className="text-3xl mx-auto mb-2" style={{ color: '#6ee7b7' }} />
              <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>No classes today — enjoy your day!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(cls => (
                <div key={cls.id}
                  className="flex items-start gap-3 p-3.5 rounded-2xl transition-colors hover:bg-white/60"
                  style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(20,184,166,0.07)' }}
                >
                  <div className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0" style={{ background: cls.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#1a2e2a' }}>{cls.courseName}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>
                      {cls.startTime}–{cls.endTime} · {cls.room}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0"
                    style={{ background: `${cls.color}18`, color: cls.color }}>
                    {cls.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent announcements */}
        <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.10)' }}>
                <HiBell className="text-base" style={{ color: '#ef4444' }} />
              </div>
              <h3 className="font-semibold text-sm" style={{ color: '#1a2e2a' }}>Announcements</h3>
            </div>
            {unread > 0 && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white"
                style={{ background: '#ef4444' }}>
                {unread} new
              </span>
            )}
          </div>
          <div className="space-y-3">
            {recentAnn.map(ann => (
              <div key={ann.id}
                className={`p-3.5 rounded-2xl transition-colors ${!ann.isRead ? 'border-l-2' : ''}`}
                style={{
                  background: !ann.isRead ? priorityBg[ann.priority] : 'rgba(255,255,255,0.55)',
                  border: !ann.isRead ? `1px solid ${priorityColors[ann.priority]}30` : '1px solid rgba(20,184,166,0.07)',
                  borderLeftColor: !ann.isRead ? priorityColors[ann.priority] : undefined,
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: priorityColors[ann.priority] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: '#1a2e2a' }}>{ann.title}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>{ann.author} · {ann.date}</p>
                  </div>
                  {!ann.isRead && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#14b8a6' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Course progress ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(13,148,136,0.10)' }}>
            <HiTrendingUp className="text-base" style={{ color: '#0d9488' }} />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: '#1a2e2a' }}>Course Progress</h3>
        </div>
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: course.color }} />
                  <span className="text-xs font-medium" style={{ color: '#4b5563' }}>
                    {course.code} — {course.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: `${course.color}18`, color: course.color }}>
                    {course.grade}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: '#9ca3af' }}>
                    {course.progress}%
                  </span>
                </div>
              </div>
              <div className="progress-track h-1.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: course.color, opacity: 0.75 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Attendance summary strip ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.10)' }}>
              <HiClipboardCheck className="text-base" style={{ color: '#f59e0b' }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: '#1a2e2a' }}>Attendance Snapshot</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <HiChevronRight className="text-sm" style={{ color: '#5eead4' }} />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {attendance.map(ca => {
            const color = ca.percentage >= 85 ? '#10b981' : ca.percentage >= 75 ? '#f59e0b' : '#ef4444';
            const bg = ca.percentage >= 85 ? 'rgba(16,185,129,0.08)' : ca.percentage >= 75 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)';
            return (
              <div key={ca.courseId}
                className="p-3 rounded-2xl text-center"
                style={{ background: bg, border: `1px solid ${color}25` }}
              >
                <p className="text-[10px] font-bold mb-1" style={{ color: ca.color }}>{ca.courseCode}</p>
                <p className="text-xl font-bold" style={{ color }}>{ca.percentage}%</p>
                <p className="text-[9px] mt-0.5" style={{ color: '#9ca3af' }}>
                  {ca.present}/{ca.totalClasses}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
