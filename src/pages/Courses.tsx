import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiUser, HiLocationMarker, HiClock, HiUsers, HiStar, HiBookOpen } from 'react-icons/hi';
import { useData } from '../context/DataContext';
import type { Course } from '../context/DataContext';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };

function GradeRing({ grade, gradePoints, color }: { grade: string; gradePoints: number; color: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const pct = gradePoints / 4.0;
  const dash = circ * pct;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(20,184,166,0.10)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <div className="text-center">
        <p className="font-bold text-lg leading-none" style={{ color: '#1a2e2a' }}>{grade}</p>
        <p className="text-[10px]" style={{ color: '#9ca3af' }}>{gradePoints.toFixed(1)}</p>
      </div>
    </div>
  );
}

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(13,148,136,0.10)' }} />
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="rounded-3xl p-6 w-full max-w-md relative z-10"
        style={{
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid rgba(20,184,166,0.16)',
          boxShadow: '0 24px 80px rgba(20,184,166,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
              style={{ background: `${course.color}18`, color: course.color }}>
              {course.code}
            </span>
            <h2 className="font-bold text-xl mt-1.5" style={{ color: '#1a2e2a' }}>{course.name}</h2>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-red-50"
            style={{ color: '#d1d5db' }}>
            <HiX className="text-lg" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <GradeRing grade={course.grade} gradePoints={course.gradePoints} color={course.color} />
          <div className="flex-1 ml-5 space-y-2">
            {[
              { icon: HiUser,           val: course.instructor },
              { icon: HiLocationMarker, val: course.room },
              { icon: HiClock,          val: course.schedule },
              { icon: HiUsers,          val: `${course.enrolled}/${course.capacity} students` },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
                <Icon className="flex-shrink-0" style={{ color: '#5eead4' }} />
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.10)' }}>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9ca3af' }}>Course Completion</p>
            <span className="font-bold text-sm" style={{ color: '#1a2e2a' }}>{course.progress}%</span>
          </div>
          <div className="progress-track h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: course.color }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          {[
            { label: 'Credits',      value: course.credits },
            { label: 'Grade Points', value: course.gradePoints.toFixed(1) },
            { label: 'Enrollment',   value: `${Math.round(course.enrolled / course.capacity * 100)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 rounded-2xl p-3 text-center"
              style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.10)' }}>
              <p className="text-[10px] mb-1" style={{ color: '#9ca3af' }}>{label}</p>
              <p className="font-bold text-lg" style={{ color: '#1a2e2a' }}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Courses() {
  const { courses, isLoading } = useData();
  const [selected, setSelected] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'A' | 'B' | 'C'>('all');

  const filtered = courses.filter(c => {
    if (filter === 'all') return true;
    return c.grade.startsWith(filter);
  });

  const totalGPA = courses.length
    ? (courses.reduce((s, c) => s + c.gradePoints * c.credits, 0) / courses.reduce((s, c) => s + c.credits, 0)).toFixed(2)
    : '—';

  return (
    <motion.div
      initial="initial" animate="animate" variants={stagger}
      className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[70px] pointer-events-none"
          style={{ background: 'rgba(167,243,208,0.35)' }} />
        <div className="relative flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(8,145,178,0.12)' }}>
                <HiBookOpen className="text-base" style={{ color: '#0891b2' }} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{ background: 'rgba(8,145,178,0.10)', color: '#0e7490' }}>
                Semester 2 · AY 2023–2024
              </span>
            </div>
            <h1 className="font-bold text-2xl mb-1" style={{ color: '#1a2e2a' }}>My Courses</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>{courses.length} courses enrolled this semester</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl px-5 py-3 text-center"
              style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.14)' }}>
              <p className="text-[10px] mb-0.5" style={{ color: '#9ca3af' }}>Semester GPA</p>
              <p className="font-bold text-2xl gradient-text">{totalGPA}</p>
            </div>
            <div className="rounded-2xl px-5 py-3 text-center"
              style={{ background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.12)' }}>
              <p className="text-[10px] mb-0.5" style={{ color: '#9ca3af' }}>Total Credits</p>
              <p className="font-bold text-2xl" style={{ color: '#0891b2' }}>{courses.reduce((s, c) => s + c.credits, 0)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
        {(['all', 'A', 'B', 'C'] as const).map(f => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200"
            style={
              filter === f
                ? { background: 'linear-gradient(135deg,#14b8a6,#0d9488)', color: '#fff', boxShadow: '0 4px 16px rgba(20,184,166,0.28)' }
                : { background: 'rgba(255,255,255,0.78)', color: '#6b7280', border: '1px solid rgba(20,184,166,0.12)' }
            }
          >
            {f === 'all' ? 'All Courses' : `Grade ${f}`}
          </motion.button>
        ))}
        <span className="ml-auto text-xs" style={{ color: '#5eead4' }}>{filtered.length} results</span>
      </motion.div>

      {/* Grid */}
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-52 rounded-3xl" />)
          : filtered.map((course, i) => (
            <motion.div
              key={course.id}
              variants={fadeUp}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(course)}
              className="glass-card rounded-3xl p-5 cursor-pointer"
            >
              {/* Color bar */}
              <div className="h-1 rounded-full mb-4" style={{ background: course.color, opacity: 0.6 }} />

              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: `${course.color}18`, color: course.color }}>
                    {course.code}
                  </span>
                  <h3 className="font-semibold text-sm mt-2 leading-snug" style={{ color: '#1a2e2a' }}>
                    {course.name}
                  </h3>
                  <p className="text-[11px] mt-1" style={{ color: '#9ca3af' }}>{course.instructor}</p>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: `${course.color}18` }}>
                    <HiStar className="text-lg" style={{ color: course.color }} />
                  </div>
                </div>
              </div>

              {/* Grade pill */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold" style={{ color: '#1a2e2a' }}>{course.grade}</span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>· {course.gradePoints.toFixed(1)} pts · {course.credits} credits</span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: '#9ca3af' }}>
                  <span>Progress</span>
                  <span className="font-semibold" style={{ color: '#4b5563' }}>{course.progress}%</span>
                </div>
                <div className="progress-track h-1.5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: course.color, opacity: 0.75 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                  />
                </div>
              </div>

              {/* Footer meta */}
              <div className="flex items-center justify-between mt-4 pt-3"
                style={{ borderTop: '1px solid rgba(20,184,166,0.08)' }}>
                <span className="text-[10px]" style={{ color: '#9ca3af' }}>
                  {course.enrolled}/{course.capacity} enrolled
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                  style={{ background: `${course.color}12`, color: course.color }}>
                  {course.room}
                </span>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
