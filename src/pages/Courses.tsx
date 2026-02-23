import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BookOpen, ExternalLink, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, Spinner, GradeColor } from '../components/Common';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Courses() {
  const { courses, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <SectionTitle subtitle={`${courses.length} enrolled courses`}>My Courses</SectionTitle>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <motion.div key={course.courseId} variants={fadeUp}>
            <GlassCard className="p-6 h-full flex flex-col" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-300" />
                </div>
                <GradeColor grade={course.grade} />
              </div>

              <h3 className="text-sm font-semibold text-white/90 mb-1 leading-snug">
                {course.courseName}
              </h3>
              <p className="text-xs text-white/40 mb-4">{course.courseId}</p>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{course.teacherName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{course.credits} Credits</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Attendance: {course.attendancePercentage}%</span>
                </div>
              </div>

              <a
                href={course.googleClassroomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Classroom
              </a>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
