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
      </div>
    );
  }

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
