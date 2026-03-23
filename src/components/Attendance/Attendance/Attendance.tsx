import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarCheck, FaCheck, FaTimes, FaClock, 
  FaCalendar, FaChartPie, FaUserCheck
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useStudentContext } from '../../context/StudentContext';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const Attendance: React.FC = () => {
  const { attendance, courses, stats } = useStudentContext();
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('December');

  const months = ['September', 'October', 'November', 'December'];

  const attendanceByCourse = courses.map(course => {
    const courseAttendance = attendance.filter(a => a.courseId === course.id);
    const present = courseAttendance.filter(a => a.status === 'present').length;
    const total = courseAttendance.length;
    return {
      ...course,
      present,
      total,
      rate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  });

  const pieData = [
    { name: 'Present', value: stats.attendanceRate, color: '#10b981' },
    { name: 'Absent', value: 100 - stats.attendanceRate, color: '#ef4444' },
  ];

  const recentAttendance = attendance.slice(-10);

  return (
    <motion.div
      {...staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="p-3 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl">
              <FaCalendarCheck className="text-white text-2xl" />
            </span>
            Attendance Tracker
          </h1>
          <p className="text-white/60 mt-2">Monitor your class attendance and participation</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#66c3b7]/50 transition-all"
          >
            {months.map(month => (
              <option key={month} value={month} className="bg-[#1b5f56]">{month} 2024</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#10b981]/30 to-[#059669]/30 rounded-2xl p-5 border border-[#10b981]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#10b981]/30 flex items-center justify-center">
              <FaUserCheck className="text-[#10b981] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats.attendanceRate}%</p>
              <p className="text-white/60 text-sm">Overall Rate</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#66c3b7]/30 to-[#2d9a8a]/30 rounded-2xl p-5 border border-[#66c3b7]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#66c3b7]/30 flex items-center justify-center">
              <FaCheck className="text-[#66c3b7] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{attendance.filter(a => a.status === 'present').length}</p>
              <p className="text-white/60 text-sm">Classes Attended</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#ef4444]/30 to-[#dc2626]/30 rounded-2xl p-5 border border-[#ef4444]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#ef4444]/30 flex items-center justify-center">
              <FaTimes className="text-[#ef4444] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{attendance.filter(a => a.status === 'absent').length}</p>
              <p className="text-white/60 text-sm">Classes Missed</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#f59e0b]/30 to-[#d97706]/30 rounded-2xl p-5 border border-[#f59e0b]/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#f59e0b]/30 flex items-center justify-center">
              <FaClock className="text-[#f59e0b] text-xl" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{attendance.filter(a => a.status === 'late').length}</p>
              <p className="text-white/60 text-sm">Late Arrivals</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <FaChartPie className="text-[#66c3b7]" />
            Attendance Overview
          </h3>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{stats.attendanceRate}%</span>
              <span className="text-white/60 text-sm mt-2">Attendance Rate</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#10b981]" />
              <span className="text-white/70 text-sm">Present</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
              <span className="text-white/70 text-sm">Absent</span>
            </div>
          </div>
        </motion.div>

        {/* Course-wise Attendance */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-xl font-bold flex items-center gap-2">
              <FaCalendar className="text-[#f59e0b]" />
              Course-wise Attendance
            </h3>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.code}</option>
              ))}
            </select>
          </div>

          <div className="space-y-5">
            {attendanceByCourse.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#66c3b7]/40 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.code.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{course.name}</h4>
                      <p className="text-white/50 text-sm">{course.code} • {course.schedule.split(' ')[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${
                      course.rate >= 90 ? 'text-[#10b981]' : course.rate >= 75 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                    }`}>
                      {course.rate}%
                    </p>
                    <p className="text-white/50 text-sm">{course.present}/{course.total} classes</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: course.rate >= 90 ? '#10b981' : course.rate >= 75 ? '#f59e0b' : '#ef4444' 
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${course.rate}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                  />
                </div>

                {/* Status Tags */}
                <div className="flex items-center gap-4 mt-4">
                  <span className="px-3 py-1.5 bg-[#10b981]/20 text-[#10b981] text-xs rounded-lg flex items-center gap-1">
                    <FaCheck /> {course.present} Present
                  </span>
                  <span className="px-3 py-1.5 bg-[#ef4444]/20 text-[#ef4444] text-xs rounded-lg flex items-center gap-1">
                    <FaTimes /> {course.total - course.present} Absent
                  </span>
                  <span className="px-3 py-1.5 bg-[#f59e0b]/20 text-[#f59e0b] text-xs rounded-lg flex items-center gap-1">
                    <FaClock /> {Math.floor(Math.random() * 3)} Late
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Attendance Records */}
      <motion.div 
        {...fadeInUp}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
      >
        <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
          <FaCalendarCheck className="text-[#8b5cf6]" />
          Recent Attendance Records
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/60 text-sm font-medium">Date</th>
                <th className="text-left py-4 px-4 text-white/60 text-sm font-medium">Course</th>
                <th className="text-left py-4 px-4 text-white/60 text-sm font-medium">Time</th>
                <th className="text-left py-4 px-4 text-white/60 text-sm font-medium">Status</th>
                <th className="text-left py-4 px-4 text-white/60 text-sm font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map((record, index) => {
                const course = courses.find(c => c.id === record.courseId);
                return (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <FaCalendar className="text-[#66c3b7]" />
                        </div>
                        <span className="text-white font-medium">{record.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{course?.code || 'N/A'}</p>
                        <p className="text-white/50 text-sm">{course?.name || 'Unknown Course'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white/70 flex items-center gap-2">
                        <FaClock className="text-[#66c3b7]" />
                        {course?.schedule.split(' ')[1] || '10:00 AM'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-fit ${
                        record.status === 'present' 
                          ? 'bg-[#10b981]/20 text-[#10b981]' 
                          : record.status === 'absent' 
                          ? 'bg-[#ef4444]/20 text-[#ef4444]' 
                          : 'bg-[#f59e0b]/20 text-[#f59e0b]'
                      }`}>
                        {record.status === 'present' && <FaCheck />}
                        {record.status === 'absent' && <FaTimes />}
                        {record.status === 'late' && <FaClock />}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white/50 text-sm">
                        {record.status === 'present' ? 'Great job!' : record.status === 'late' ? '15 mins late' : '—'}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Attendance;
