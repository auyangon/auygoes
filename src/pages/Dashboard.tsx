import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, GlassBadge } from '../components/Common';
import { User, Award, GraduationCap, BookMarked, ArrowUpRight, CheckCircle2, Calendar, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

// Import generated academic events
import academicEvents from '../data/academicEvents.json';

// Myanmar Public Holidays 2026 (static)
const MYANMAR_HOLIDAYS_2026 = [
  { date: '2026-01-01', title: 'New Year\'s Day', description: 'International New Year', type: 'public' },
  { date: '2026-01-02', title: 'New Year\'s Holiday', description: 'Day after New Year', type: 'public' },
  { date: '2026-01-03', title: 'New Year\'s Holiday', description: 'New Year holiday', type: 'public' },
  { date: '2026-01-04', title: 'Independence Day', description: 'Independence from British rule in 1948', type: 'public' },
  // ... include all the other holidays from previous answer ...
  // (copy the full list from earlier)
  { date: '2026-12-25', title: 'Christmas Day', description: 'Birth of Jesus Christ', type: 'public' },
  { date: '2026-12-26', title: 'Christmas Holiday', description: 'Day after Christmas', type: 'public' },
];

// Combine all important dates
const ALL_IMPORTANT_DATES = [...MYANMAR_HOLIDAYS_2026, ...academicEvents];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    courses, 
    gpa, 
    totalCredits, 
    attendance, 
    studentName, 
    studentId, 
    major, 
    loading,
    announcements = []  // will be used later
  } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Calendar Widget (same as before)
  const CalendarWidget = ({ dates }: { dates: { date: string; title: string; description?: string; type?: string }[] }) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const eventsMap = new Map();
    dates.forEach(d => {
      if (!eventsMap.has(d.date)) eventsMap.set(d.date, []);
      eventsMap.get(d.date).push({ title: d.title, description: d.description, type: d.type });
    });

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = eventsMap.get(dateStr) || [];
      days.push({ day: d, events: dayEvents });
    }

    const getDayClass = (events: any[]) => {
      if (events.length === 0) return 'text-white/80';
      const hasAcademic = events.some(e => e.type === 'academic');
      const hasPublic = events.some(e => e.type === 'public');
      if (hasAcademic && hasPublic) return 'bg-purple-500/30 text-purple-300 font-bold ring-2 ring-purple-500/50';
      if (hasAcademic) return 'bg-blue-500/30 text-blue-300 font-bold ring-2 ring-blue-500/50';
      return 'bg-emerald-500/30 text-emerald-300 font-bold ring-2 ring-emerald-500/50';
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-semibold">{monthNames[month]} {year}</h3>
          <span className="text-xs text-white/40">{dates.length} events this month</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {daysOfWeek.map(day => <div key={day} className="text-white/40 font-medium">{day}</div>)}
          {days.map((day, idx) => (
            <div key={idx} className="aspect-square flex items-center justify-center">
              {day ? (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative group ${getDayClass(day.events)}`}>
                  {day.day}
                  {day.events.length > 0 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max max-w-48">
                      <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 shadow-lg">
                        {day.events.map((ev, i) => (
                          <div key={i} className={i > 0 ? 'mt-1 pt-1 border-t border-white/10' : ''}>
                            <div className="font-semibold flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${ev.type === 'academic' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                              {ev.title}
                            </div>
                            {ev.description && <div className="text-white/70 text-[10px]">{ev.description}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : <div />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">
          Hello, {studentName ? studentName.split(' ')[0] : 'Student'}
        </h2>
        <p className="text-white/60">Welcome to American University of Yangon.</p>
      </header>

      {/* Stats cards (same as before) */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... your existing stats cards ... */}
      </motion.div>

      {/* Current Courses (same as before) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <SectionTitle>Current Courses</SectionTitle>
          <button className="text-emerald-400 text-sm font-medium flex items-center gap-1 hover:underline decoration-2">
            View all <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 4).map((course, idx) => (
            <motion.div key={course.courseId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (idx * 0.1) }}>
              <GlassCard className="p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <BookMarked className="text-emerald-400" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{course.name}</h4>
                  <p className="text-xs text-white/40 truncate">{course.courseId} • {course.credits} Credits</p>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-lg">{course.grade || '-'}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Calendar & Announcements */}
      <section className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Card */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-emerald-400" size={20} />
              <SectionTitle className="!mb-0">Important Dates</SectionTitle>
            </div>
            <CalendarWidget dates={ALL_IMPORTANT_DATES} />
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/30 ring-2 ring-emerald-500/50" />
                  <span className="text-white/60">Public Holiday</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500/30 ring-2 ring-blue-500/50" />
                  <span className="text-white/60">Academic Event</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Announcements Card (placeholder) */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="text-emerald-400" size={20} />
              <SectionTitle className="!mb-0">Announcements</SectionTitle>
            </div>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {announcements.length > 0 ? (
                announcements.map((ann, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <h4 className="text-white font-medium text-sm">{ann.title}</h4>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-emerald-400/60 text-xs mt-1">{ann.date}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/40 text-sm">No announcements at this time.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};