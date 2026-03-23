import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaBookOpen, FaTrophy, FaCalendarCheck, FaStar, 
  FaChartLine, FaClock, FaArrowRight, FaFire,
  FaMedal, FaRocket
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useStudentContext } from '../../context/StudentContext';
import { staggerContainer, fadeInUp, scaleIn, statNumberAnimation } from '../../utils/animations';

const weeklyData = [
  { day: 'Mon', xp: 120, attendance: 95 },
  { day: 'Tue', xp: 180, attendance: 100 },
  { day: 'Wed', xp: 150, attendance: 90 },
  { day: 'Thu', xp: 220, attendance: 100 },
  { day: 'Fri', xp: 190, attendance: 95 },
  { day: 'Sat', xp: 80, attendance: 85 },
  { day: 'Sun', xp: 60, attendance: 100 },
];

const performanceData = [
  { name: 'Week 1', performance: 65 },
  { name: 'Week 2', performance: 72 },
  { name: 'Week 3', performance: 68 },
  { name: 'Week 4', performance: 85 },
  { name: 'Week 5', performance: 90 },
  { name: 'Week 6', performance: 88 },
];

const Dashboard: React.FC = () => {
  const { student, courses, quests, stats, schedule } = useStudentContext();

  const statsCards = [
    { 
      icon: FaBookOpen, 
      label: 'Active Courses', 
      value: stats.totalCourses, 
      color: '#66c3b7', 
      gradient: 'from-[#66c3b7] to-[#2d9a8a]',
      bgGradient: 'from-[#66c3b7]/20 to-[#2d9a8a]/20',
      subtitle: 'This semester'
    },
    { 
      icon: FaTrophy, 
      label: 'Quests Done', 
      value: stats.completedQuests, 
      color: '#f59e0b', 
      gradient: 'from-[#f59e0b] to-[#ef4444]',
      bgGradient: 'from-[#f59e0b]/20 to-[#ef4444]/20',
      subtitle: 'Total completed'
    },
    { 
      icon: FaCalendarCheck, 
      label: 'Attendance', 
      value: `${stats.attendanceRate}%`, 
      color: '#10b981', 
      gradient: 'from-[#10b981] to-[#059669]',
      bgGradient: 'from-[#10b981]/20 to-[#059669]/20',
      subtitle: 'Current rate'
    },
    { 
      icon: FaStar, 
      label: 'Total XP', 
      value: stats.xp.toLocaleString(), 
      color: '#8b5cf6', 
      gradient: 'from-[#8b5cf6] to-[#6366f1]',
      bgGradient: 'from-[#8b5cf6]/20 to-[#6366f1]/20',
      subtitle: 'All time XP'
    },
  ];

  const todaySchedule = schedule.slice(0, 4);

  return (
    <motion.div
      {...staggerContainer}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div {...fadeInUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2d9a8a]/40 via-[#66c3b7]/40 to-[#1b5f56]/40 p-8 border border-[#66c3b7]/30 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#66c3b7]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="px-4 py-1.5 bg-[#66c3b7]/30 rounded-full text-[#66c3b7] text-sm font-medium border border-[#66c3b7]/30">
                  👋 Welcome back!
                </span>
                <span className="px-4 py-1.5 bg-white/10 rounded-full text-white/70 text-sm font-medium border border-white/20">
                  Level {stats.level} Student
                </span>
              </motion.div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Good Morning, <span className="bg-gradient-to-r from-[#66c3b7] to-[#2d9a8a] bg-clip-text text-transparent">{student?.name || 'Student'}</span>!
              </h1>
              <p className="text-white/60 text-lg mt-3">
                Ready to continue your learning journey? You have <span className="text-[#66c3b7] font-semibold">{quests.filter(q => q.status === 'in-progress').length}</span> quests in progress.
              </p>
            </div>
            <motion.div 
              {...scaleIn}
              className="flex items-center gap-4"
            >
              <div className="text-center p-5 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-lg">
                <p className="text-3xl font-bold text-white">#{stats.rank}</p>
                <p className="text-white/60 text-sm">Class Rank</p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-[#f59e0b]/30 to-[#ef4444]/30 rounded-2xl border border-[#f59e0b]/30 backdrop-blur-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaFire className="text-[#f59e0b]" />
                  <span className="text-2xl font-bold text-white">15</span>
                </div>
                <p className="text-white/60 text-sm">Day Streak</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            {...fadeInUp}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" style={{ background: `linear-gradient(135deg, ${stat.color}40, transparent)` }} />
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 hover:border-[#66c3b7]/40 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" style={{ background: `linear-gradient(135deg, ${stat.color}, transparent)` }} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-white text-2xl" />
                  </div>
                  <motion.div 
                    {...statNumberAnimation}
                    className="text-3xl font-bold text-white"
                  >
                    {stat.value}
                  </motion.div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{stat.label}</h3>
                <p className="text-white/50 text-sm">{stat.subtitle}</p>
                
                {/* Progress bar */}
                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(Number(String(stat.value).replace(/%/g, '')), 100)}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <FaChartLine className="text-[#66c3b7]" />
                Performance Overview
              </h3>
              <p className="text-white/50 text-sm mt-1">Your academic progress over time</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-[#66c3b7]/20 text-[#66c3b7] text-xs rounded-lg border border-[#66c3b7]/30">Weekly</span>
              <span className="px-3 py-1.5 bg-white/5 text-white/50 text-xs rounded-lg border border-white/10">Monthly</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66c3b7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#66c3b7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(27, 95, 86, 0.95)', 
                    border: '1px solid rgba(102, 195, 183, 0.3)',
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#66c3b7" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPerformance)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-xl font-bold flex items-center gap-2">
                <FaClock className="text-[#f59e0b]" />
                Today's Schedule
              </h3>
              <p className="text-white/50 text-sm mt-1">Your classes for today</p>
            </div>
            <button className="text-[#66c3b7] text-sm hover:underline flex items-center gap-1">
              View All <FaArrowRight />
            </button>
          </div>
          <div className="space-y-4">
            {todaySchedule.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#66c3b7]/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-1.5 h-16 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate">{item.courseName}</h4>
                    <p className="text-white/50 text-sm mt-1">{item.room}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaClock className="text-[#66c3b7] text-xs" />
                      <span className="text-white/60 text-xs">{item.startTime} - {item.endTime}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly XP Chart */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20"
        >
          <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <FaRocket className="text-[#8b5cf6]" />
            Weekly XP Gain
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(27, 95, 86, 0.95)', 
                    border: '1px solid rgba(102, 195, 183, 0.3)',
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions & Progress */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20"
        >
          <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <FaMedal className="text-[#f59e0b]" />
            Course Progress
          </h3>
          <div className="space-y-5">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: course.color }}
                    >
                      {course.code.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{course.code}</h4>
                      <p className="text-white/50 text-xs">{course.name}</p>
                    </div>
                  </div>
                  <span className="text-[#66c3b7] font-bold text-lg">{course.progress}%</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: course.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
