import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  User,
  Award,
  BookOpen,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, Spinner, GradeColor } from '../components/Common';
import { Link } from 'react-router-dom';

const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function GPARing({ gpa }: { gpa: number }) {
  const percentage = (gpa / 4) * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#gpaGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white/90">{gpa.toFixed(2)}</span>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">GPA</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { student, courses, gpa, totalCredits, averageAttendance, loading, error } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white/70 text-center py-12">
        {error}
      </div>
    );
  }

  const displayCourses = courses.slice(0, 4);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Fun welcome message */}
      <motion.div variants={fadeUp} className="text-center mb-2">
        <span className="inline-block px-4 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium">
          🎓 yo yo yo welcome to AUY portal!
        </span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight">
            Welcome back{student?.studentName ? `, ${student.studentName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-white/40 mt-1 text-sm">Here's your academic overview</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Card */}
        <motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1">
          <GlassCard className="p-6 h-full" hover>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90 truncate">{student?.studentName}</p>
                <p className="text-xs text-white/40 truncate">{student?.studentId}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Major</span>
                <span className="text-white/70 font-medium">{student?.major}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Mode</span>
                <span className="text-white/70 font-medium">{student?.studyMode}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Attendance</span>
                <span className="text-emerald-300 font-medium">{averageAttendance.toFixed(0)}%</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* GPA */}
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 h-full flex flex-col items-center justify-center" hover>
            <GPARing gpa={gpa} />
            <p className="text-xs text-white/40 mt-3 text-center">Cumulative GPA</p>
          </GlassCard>
        </motion.div>

        {/* Credits */}
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 h-full" hover>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-cyan-300" />
            </div>
            <p className="text-3xl font-bold text-white/90">{totalCredits}</p>
            <p className="text-xs text-white/40 mt-1">Credits Earned</p>
            <div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalCredits / 124) * 100, 100)}%` }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
              />
            </div>
            <p className="text-[10px] text-white/30 mt-1.5">{totalCredits} / 124 required</p>
          </GlassCard>
        </motion.div>

        {/* Attendance */}
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6 h-full" hover>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-3xl font-bold text-white/90">{averageAttendance.toFixed(0)}%</p>
            <p className="text-xs text-white/40 mt-1">Avg Attendance</p>
            <div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
                initial={{ width: 0 }}
                animate={{ width: `${averageAttendance}%` }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
              />
            </div>
            <p className="text-[10px] text-white/30 mt-1.5">{courses.length} courses tracked</p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Current Courses */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle className="mb-0">Current Courses</SectionTitle>
          <Link
            to="/courses"
            className="flex items-center gap-1 text-xs text-emerald-400/70 hover:text-emerald-300 transition-colors"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayCourses.length > 0 ? (
            displayCourses.map((course) => (
              <motion.div key={course.courseId} variants={fadeUp}>
                <GlassCard className="p-5" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white/90 truncate">{course.courseName}</p>
                      <p className="text-xs text-white/40 mt-0.5">{course.courseId}</p>
                    </div>
                    <GradeColor grade={course.grade} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.credits} credits
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {course.attendancePercentage}%
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <p className="text-white/50 col-span-2 text-center py-8">No courses found.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}