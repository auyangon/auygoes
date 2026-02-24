<<<<<<< HEAD
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle } from '../components/Common';
import { Award, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const Grades: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, loading } = useData();

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    if (grade.startsWith('D')) return 'text-orange-400';
    if (grade === 'F') return 'text-red-400';
    return 'text-white/60';
  };

  const gradePoints: Record<string, number> = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
=======
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, Spinner, GradeColor } from '../components/Common';
import { GRADE_POINTS } from '../services/firebaseData';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function gradeRowBg(grade: string): string {
  if (grade.startsWith('A')) return 'bg-emerald-500/[0.04]';
  if (grade.startsWith('B')) return 'bg-blue-500/[0.04]';
  if (grade.startsWith('C')) return 'bg-yellow-500/[0.04]';
  if (grade.startsWith('D')) return 'bg-orange-500/[0.04]';
  if (grade === 'F') return 'bg-red-500/[0.04]';
  return '';
}

export default function Grades() {
  const { courses, gpa, totalCredits, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
      </div>
    );
  }

<<<<<<< HEAD
  const coursesWithGrades = courses.filter(c => c.grade);

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">Academic Progress</h2>
        <p className="text-white/60">Your grades and performance metrics</p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <Award className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Current GPA</p>
              <p className="text-3xl font-bold text-white">{gpa.toFixed(2)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <TrendingUp className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Total Credits</p>
              <p className="text-3xl font-bold text-white">{totalCredits}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <BookOpen className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-white/40 text-sm">Courses Completed</p>
              <p className="text-3xl font-bold text-white">{coursesWithGrades.length}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <SectionTitle>Grade Details</SectionTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-4 text-white/70 font-medium">Course</th>
                <th className="text-left p-4 text-white/70 font-medium">Code</th>
                <th className="text-left p-4 text-white/70 font-medium">Credits</th>
                <th className="text-left p-4 text-white/70 font-medium">Grade</th>
                <th className="text-left p-4 text-white/70 font-medium">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {coursesWithGrades.map((course, idx) => {
                const points = gradePoints[course.grade as keyof typeof gradePoints] || 0;
                
                return (
                  <motion.tr 
                    key={course.courseId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/5"
                  >
                    <td className="p-4 text-white">{course.name}</td>
                    <td className="p-4 text-white/60">{course.courseId}</td>
                    <td className="p-4 text-white/60">{course.credits}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/10 ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="p-4 text-white/60">{points.toFixed(1)}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
=======
  const completedCourses = courses.filter(c => c.grade && GRADE_POINTS[c.grade] !== undefined);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <SectionTitle subtitle="Academic performance overview">Grades</SectionTitle>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={fadeUp}>
          <GlassCard className="p-5 flex items-center gap-4" hover>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white/90">{gpa.toFixed(2)}</p>
              <p className="text-xs text-white/40">Cumulative GPA</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="p-5 flex items-center gap-4" hover>
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white/90">{totalCredits}</p>
              <p className="text-xs text-white/40">Total Credits</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="p-5 flex items-center gap-4" hover>
            <div className="w-11 h-11 rounded-2xl bg-teal-500/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white/90">{completedCourses.length}</p>
              <p className="text-xs text-white/40">Courses Completed</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Grades Table */}
      <motion.div variants={fadeUp}>
        <GlassCard className="overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-6 py-4">Course</th>
                  <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-6 py-4">Code</th>
                  <th className="text-center text-xs font-medium text-white/40 uppercase tracking-wider px-6 py-4">Credits</th>
                  <th className="text-center text-xs font-medium text-white/40 uppercase tracking-wider px-6 py-4">Grade</th>
                  <th className="text-center text-xs font-medium text-white/40 uppercase tracking-wider px-6 py-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.courseId}
                    className={`border-b border-white/[0.04] last:border-0 ${gradeRowBg(course.grade)} transition-colors hover:bg-white/[0.03]`}
                  >
                    <td className="px-6 py-4 text-sm text-white/80 font-medium">{course.courseName}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{course.courseId}</td>
                    <td className="px-6 py-4 text-sm text-white/60 text-center">{course.credits}</td>
                    <td className="px-6 py-4 text-center">
                      <GradeColor grade={course.grade} />
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60 text-center">
                      {course.grade && GRADE_POINTS[course.grade] !== undefined
                        ? (GRADE_POINTS[course.grade] * course.credits).toFixed(1)
                        : '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-white/[0.06]">
            {courses.map((course) => (
              <div key={course.courseId} className={`p-4 ${gradeRowBg(course.grade)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/85 truncate">{course.courseName}</p>
                    <p className="text-xs text-white/40">{course.courseId}</p>
                  </div>
                  <GradeColor grade={course.grade} />
                </div>
                <div className="flex gap-4 text-xs text-white/40">
                  <span>{course.credits} credits</span>
                  <span>
                    {course.grade && GRADE_POINTS[course.grade] !== undefined
                      ? `${(GRADE_POINTS[course.grade] * course.credits).toFixed(1)} pts`
                      : '\u2014'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
