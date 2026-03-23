import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBook, FaPlay, FaFileAlt, FaVideo, FaLink, 
  FaClock, FaUser, FaGraduationCap, FaCheckCircle,
  FaSearch, FaChevronRight
} from 'react-icons/fa';
import { useStudentContext } from '../../context/StudentContext';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const Courses: React.FC = () => {
  const { courses } = useStudentContext();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && course.progress < 100) ||
                          (filterStatus === 'completed' && course.progress >= 100);
    return matchesSearch && matchesFilter;
  });

  const courseMaterials = [
    { type: 'video', title: 'Introduction Lecture', duration: '45:30', icon: FaVideo },
    { type: 'document', title: 'Course Syllabus', duration: 'PDF', icon: FaFileAlt },
    { type: 'video', title: 'Chapter 1 - Basics', duration: '32:15', icon: FaVideo },
    { type: 'link', title: 'Online Resources', duration: 'URL', icon: FaLink },
    { type: 'document', title: 'Assignment 1', duration: 'DOCX', icon: FaFileAlt },
  ];

  return (
    <motion.div
      {...staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-3 bg-gradient-to-br from-[#66c3b7] to-[#2d9a8a] rounded-2xl">
              <FaBook className="text-white text-2xl" />
            </span>
            My Courses
          </h1>
          <p className="text-white/60 mt-2">Explore and manage your enrolled courses</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#66c3b7]/50 transition-all w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#66c3b7]/50 transition-all"
          >
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          {...fadeInUp} 
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#66c3b7]/30 to-[#2d9a8a]/30 rounded-2xl p-5 border border-[#66c3b7]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#66c3b7]/30 flex items-center justify-center">
              <FaBook className="text-[#66c3b7] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{courses.length}</p>
              <p className="text-white/60 text-sm">Total Courses</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp} 
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#10b981]/30 to-[#059669]/30 rounded-2xl p-5 border border-[#10b981]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#10b981]/30 flex items-center justify-center">
              <FaCheckCircle className="text-[#10b981] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{courses.filter(c => c.progress >= 100).length}</p>
              <p className="text-white/60 text-sm">Completed</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp} 
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#f59e0b]/30 to-[#ef4444]/30 rounded-2xl p-5 border border-[#f59e0b]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#f59e0b]/30 flex items-center justify-center">
              <FaClock className="text-[#f59e0b] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{courses.filter(c => c.progress < 100).length}</p>
              <p className="text-white/60 text-sm">In Progress</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp} 
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#8b5cf6]/30 to-[#6366f1]/30 rounded-2xl p-5 border border-[#8b5cf6]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#8b5cf6]/30 flex items-center justify-center">
              <FaGraduationCap className="text-[#8b5cf6] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{courses.reduce((sum, c) => sum + c.credits, 0)}</p>
              <p className="text-white/60 text-sm">Total Credits</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            {...fadeInUp}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            className="cursor-pointer"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 hover:border-[#66c3b7]/40 transition-all duration-300">
              {/* Course Header */}
              <div 
                className="h-36 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${course.color}40, ${course.color}20)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e28] to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-white text-sm font-medium border border-white/30">
                    {course.code}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    course.progress >= 100 
                      ? 'bg-[#10b981]/30 text-[#10b981] border border-[#10b981]/30' 
                      : 'bg-[#f59e0b]/30 text-[#f59e0b] border border-[#f59e0b]/30'
                  }`}>
                    {course.progress >= 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Course Body */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">
                  Dive deep into {course.name} and master the fundamentals of this subject area.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-2 text-white/70">
                    <FaUser className="text-[#66c3b7]" />
                    <span className="text-sm">{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <FaGraduationCap className="text-[#66c3b7]" />
                    <span className="text-sm">{course.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <FaClock className="text-[#66c3b7]" />
                    <span className="text-sm truncate">{course.schedule.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <FaBook className="text-[#66c3b7]" />
                    <span className="text-sm">{course.room}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm">Course Progress</span>
                    <span className="text-[#66c3b7] font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundColor: course.color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#66c3b7] to-[#2d9a8a] rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#66c3b7]/30 transition-all"
                >
                  <FaPlay className="text-sm" />
                  Continue Learning
                  <FaChevronRight className="text-sm" />
                </motion.button>
              </div>

              {/* Expanded Materials Section */}
              <AnimatePresence>
                {selectedCourse === course.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6">
                      <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <FaFileAlt className="text-[#66c3b7]" />
                        Course Materials
                      </h4>
                      <div className="space-y-3">
                        {courseMaterials.map((material, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#66c3b7]/30 to-[#2d9a8a]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <material.icon className="text-[#66c3b7]" />
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{material.title}</p>
                                <p className="text-white/50 text-xs">{material.type} • {material.duration}</p>
                              </div>
                            </div>
                            <FaChevronRight className="text-white/40 group-hover:text-[#66c3b7] transition-colors" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Courses;
