<<<<<<< HEAD
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle } from '../components/Common';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const Progress: React.FC = () => {
  const { user } = useAuth();
  const { gpa, totalCredits, attendance, courses } = useData();

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">Academic Progress</h2>
        <p className="text-white/60">Track your journey to graduation</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <Target className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Credits Goal</p>
              <p className="text-2xl font-bold text-white">{totalCredits}/124</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(totalCredits / 124) * 100}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Current GPA</p>
              <p className="text-2xl font-bold text-white">{gpa.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(gpa / 4) * 100}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <Calendar className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Attendance</p>
              <p className="text-2xl font-bold text-white">{attendance}%</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full" style={{ width: `${attendance}%` }} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <Award className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Courses Done</p>
              <p className="text-2xl font-bold text-white">{courses.length}/40</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(courses.length / 40) * 100}%` }} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
=======
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Target, TrendingUp, Calendar, Award, CheckCircle2, BookOpen } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, Spinner } from '../components/Common';
import { GRADE_POINTS } from '../services/firebaseData';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

function ProgressBar({ label, value, max, unit, icon, color, delay = 0 }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <GlassCard className="p-6" hover>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-white/[0.06] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="text-xs text-white/40">
            {value.toFixed(label.includes('GPA') ? 2 : 0)}{unit ? ` ${unit}` : ''} / {max}{unit ? ` ${unit}` : ''}
          </p>
        </div>
        <span className="text-2xl font-bold text-white/90">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay }}
        />
      </div>
    </GlassCard>
  );
}

export default function Progress() {
  const { courses, gpa, totalCredits, averageAttendance, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const completedCourses = courses.filter(c => c.grade && GRADE_POINTS[c.grade] !== undefined).length;
  const totalCourses = courses.length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <SectionTitle subtitle="Track your academic journey">Academic Progress</SectionTitle>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <ProgressBar
            label="Credit Completion"
            value={totalCredits}
            max={124}
            unit="credits"
            icon={<Target className="w-5 h-5 text-emerald-300" />}
            color="bg-gradient-to-r from-emerald-500 to-emerald-300"
            delay={0.1}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <ProgressBar
            label="GPA Progress"
            value={gpa}
            max={4}
            icon={<TrendingUp className="w-5 h-5 text-cyan-300" />}
            color="bg-gradient-to-r from-cyan-500 to-cyan-300"
            delay={0.2}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <ProgressBar
            label="Average Attendance"
            value={averageAttendance}
            max={100}
            unit="%"
            icon={<Calendar className="w-5 h-5 text-teal-300" />}
            color="bg-gradient-to-r from-teal-500 to-teal-300"
            delay={0.3}
          />
        </motion.div>

        <motion.div variants={fadeUp}>
          <ProgressBar
            label="Courses Completed"
            value={completedCourses}
            max={Math.max(totalCourses, 1)}
            icon={<BookOpen className="w-5 h-5 text-violet-300" />}
            color="bg-gradient-to-r from-violet-500 to-violet-300"
            delay={0.4}
          />
        </motion.div>
      </div>

      {/* Milestones */}
      <motion.div variants={fadeUp}>
        <SectionTitle subtitle="Key achievements" className="mt-2">Milestones</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Award className="w-6 h-6 text-emerald-300" />,
              label: "Dean's List",
              status: gpa >= 3.5 ? 'Achieved' : 'In Progress',
              achieved: gpa >= 3.5,
              desc: 'GPA \u2265 3.50',
            },
            {
              icon: <CheckCircle2 className="w-6 h-6 text-cyan-300" />,
              label: 'Perfect Attendance',
              status: averageAttendance >= 95 ? 'Achieved' : 'In Progress',
              achieved: averageAttendance >= 95,
              desc: 'Attendance \u2265 95%',
            },
            {
              icon: <Target className="w-6 h-6 text-teal-300" />,
              label: 'Halfway There',
              status: totalCredits >= 62 ? 'Achieved' : 'In Progress',
              achieved: totalCredits >= 62,
              desc: '62+ credits earned',
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-violet-300" />,
              label: 'Honor Roll',
              status: gpa >= 3.0 ? 'Achieved' : 'In Progress',
              achieved: gpa >= 3.0,
              desc: 'GPA \u2265 3.00',
            },
          ].map((m) => (
            <GlassCard
              key={m.label}
              className={`p-5 text-center ${m.achieved ? 'ring-1 ring-emerald-500/20' : 'opacity-60'}`}
              hover
            >
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
                {m.icon}
              </div>
              <p className="text-sm font-semibold text-white/85">{m.label}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{m.desc}</p>
              <span
                className={`inline-block mt-2 text-[10px] font-medium px-2.5 py-1 rounded-full ${
                  m.achieved
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-white/[0.06] text-white/40'
                }`}
              >
                {m.status}
              </span>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
