<<<<<<< HEAD
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/Common';
import { BookOpen, Clock, User, ExternalLink, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const Courses: React.FC = () => {
  const { user } = useAuth();
=======
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
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
  const { courses, loading } = useData();

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
=======
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">My Courses</h2>
        <p className="text-white/60">Spring Semester 2026</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <motion.div
            key={course.courseId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6 h-full flex flex-col hover:scale-[1.02] transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <BookOpen className="text-emerald-400" size={24} />
                </div>
                <span className="text-white/40 text-sm">{course.courseId}</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{course.name}</h3>
              
              <div className="space-y-2 text-white/60 text-sm mb-4 flex-1">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>{course.teacherName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{course.credits} credits</span>
                </div>
                {course.grade && (
                  <div className="flex items-center gap-2 mt-2">
                    <Award size={14} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Current Grade: {course.grade}</span>
                  </div>
                )}
              </div>

              <a
                href={course.googleClassroomLink || `https://classroom.google.com/c/${course.courseId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white/90 transition"
              >
                Open Classroom <ExternalLink size={16} />
=======
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
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
              </a>
            </GlassCard>
          </motion.div>
        ))}
      </div>
<<<<<<< HEAD
    </div>
  );
};
=======
    </motion.div>
  );
}
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
