import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, GlassBadge } from '../components/Common';
import { User, Award, GraduationCap, BookMarked, ArrowUpRight, CheckCircle2, Calendar, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

// ----- ALL DATES ARE STATIC (Myanmar 2026) -----

const MYANMAR_HOLIDAYS_2026 = [
  { date: '2026-01-01', title: 'New Year\'s Day', description: 'International New Year', type: 'public' },
  { date: '2026-01-02', title: 'New Year\'s Holiday', description: 'Day after New Year', type: 'public' },
  { date: '2026-01-03', title: 'New Year\'s Holiday', description: 'New Year holiday', type: 'public' },
  { date: '2026-01-04', title: 'Independence Day', description: 'Independence from British rule in 1948', type: 'public' },
  { date: '2026-02-12', title: 'Union Day', description: 'Anniversary of the Panglong Agreement', type: 'public' },
  { date: '2026-02-13', title: 'Union Day Holiday', description: 'Union Day bridge holiday', type: 'public' },
  { date: '2026-02-16', title: 'Chinese New Year Holiday', description: 'Eve of Chinese New Year', type: 'public' },
  { date: '2026-02-17', title: 'Chinese New Year', description: 'Start of Lunar New Year', type: 'public' },
  { date: '2026-03-02', title: 'Peasants\' Day / Full Moon of Tabaung', description: 'Honoring farmers and Tabaung festival', type: 'public' },
  { date: '2026-03-27', title: 'Armed Forces Day', description: 'Resistance Day against Japanese occupation', type: 'public' },
  { date: '2026-03-28', title: 'Armed Forces Day Holiday', description: 'Armed Forces Day bridge holiday', type: 'public' },
  { date: '2026-04-11', title: 'Thingyan', description: 'Water Festival begins', type: 'public' },
  { date: '2026-04-12', title: 'Thingyan', description: 'Water Festival', type: 'public' },
  { date: '2026-04-13', title: 'Thingyan', description: 'Water Festival', type: 'public' },
  { date: '2026-04-14', title: 'Thingyan', description: 'Water Festival', type: 'public' },
  { date: '2026-04-15', title: 'Thingyan', description: 'Water Festival', type: 'public' },
  { date: '2026-04-16', title: 'Thingyan', description: 'Water Festival', type: 'public' },
  { date: '2026-04-17', title: 'Myanmar New Year', description: 'First day of the Myanmar calendar', type: 'public' },
  { date: '2026-04-18', title: 'Myanmar New Year Holiday', description: 'New Year holiday', type: 'public' },
  { date: '2026-04-19', title: 'Myanmar New Year Holiday', description: 'New Year holiday', type: 'public' },
  { date: '2026-04-30', title: 'Full Moon Day of Kasone', description: 'Buddha\'s birth, enlightenment, and death', type: 'public' },
  { date: '2026-05-01', title: 'Labour Day', description: 'International Workers\' Day', type: 'public' },
  { date: '2026-05-27', title: 'Eid ul-Adha', description: 'Feast of Sacrifice (dates may be adjusted based on moon sighting)', type: 'public' },
  { date: '2026-07-19', title: 'Martyrs\' Day', description: 'Assassination of Aung San and cabinet members', type: 'public' },
  { date: '2026-07-29', title: 'Full Moon Day of Waso', description: 'Beginning of Buddhist Lent', type: 'public' },
  { date: '2026-10-24', title: 'Thadingyut Holiday', description: 'End of Buddhist Lent - Festival of Lights', type: 'public' },
  { date: '2026-10-25', title: 'Thadingyut Holiday', description: 'Festival of Lights', type: 'public' },
  { date: '2026-10-26', title: 'Full Moon Day of Thadingyut', description: 'Peak of the Festival of Lights', type: 'public' },
  { date: '2026-10-27', title: 'Thadingyut Holiday', description: 'Festival of Lights continues', type: 'public' },
  { date: '2026-11-08', title: 'Deepavali', description: 'Hindu Festival of Lights (date may be adjusted)', type: 'public' },
  { date: '2026-11-21', title: 'Tazaungmone Holiday', description: 'Festival of Floating Lights', type: 'public' },
  { date: '2026-11-22', title: 'Tazaungmone Holiday', description: 'Festival of Floating Lights', type: 'public' },
  { date: '2026-11-23', title: 'Tazaungmone Holiday', description: 'Festival of Floating Lights', type: 'public' },
  { date: '2026-11-24', title: 'Full Moon Day of Tazaungmone', description: 'Peak of the Floating Lights festival', type: 'public' },
  { date: '2026-12-04', title: 'National Day', description: 'Anniversary of the 1920 university students\' strike', type: 'public' },
  { date: '2026-12-05', title: 'National Day Holiday', description: 'National Day bridge holiday', type: 'public' },
  { date: '2026-12-25', title: 'Christmas Day', description: 'Birth of Jesus Christ', type: 'public' },
  { date: '2026-12-26', title: 'Christmas Holiday', description: 'Day after Christmas', type: 'public' },
];

const ACADEMIC_EVENTS_2026 = [
  { date: '2026-02-18', title: 'Orientation', description: 'Start of Orientation', type: 'academic' },
  { date: '2026-02-19', title: 'Semester Start', description: 'Start of Semester', type: 'academic' },
  { date: '2026-04-06', title: 'Midterm Exam', description: 'Start of Midterm Exam', type: 'academic' },
  { date: '2026-04-07', title: 'Midterm Exam', description: 'Midterm Exam (day)', type: 'academic' },
  { date: '2026-04-08', title: 'Midterm Exam', description: 'Midterm Exam (day)', type: 'academic' },
  { date: '2026-04-09', title: 'Midterm Exam', description: 'Midterm Exam (day)', type: 'academic' },
  { date: '2026-04-10', title: 'Midterm Exam', description: 'End of Midterm Exam', type: 'academic' },
  { date: '2026-06-08', title: 'Final Exam', description: 'Start of Final Exam', type: 'academic' },
  { date: '2026-06-09', title: 'Final Exam', description: 'Final Exam (day)', type: 'academic' },
  { date: '2026-06-10', title: 'Final Exam', description: 'Final Exam (day)', type: 'academic' },
  { date: '2026-06-11', title: 'Final Exam', description: 'Final Exam (day)', type: 'academic' },
  { date: '2026-06-12', title: 'Final Exam', description: 'End of Final Exam', type: 'academic' },
  { date: '2026-06-12', title: 'Semester End', description: 'Semester End', type: 'academic' },
  { date: '2026-06-15', title: 'Term Break', description: 'Start of Term Break', type: 'academic' },
  { date: '2026-06-16', title: 'Term Break', description: 'Term Break (day)', type: 'academic' },
  { date: '2026-06-17', title: 'Term Break', description: 'Term Break (day)', type: 'academic' },
  { date: '2026-06-18', title: 'Term Break', description: 'Term Break (day)', type: 'academic' },
  { date: '2026-06-19', title: 'Term Break', description: 'End of Term Break', type: 'academic' },
  { date: '2026-06-26', title: 'Grade Submission', description: 'Grade Submission', type: 'academic' },
];

const ALL_IMPORTANT_DATES = [...MYANMAR_HOLIDAYS_2026, ...ACADEMIC_EVENTS_2026];

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
    announcements = []
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
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">
          Hello, {studentName ? studentName.split(' ')[0] : 'Student'}
        </h2>
        <p className="text-white/60">Welcome to American University of Yangon.</p>
      </header>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <GlassCard className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <User className="text-emerald-400" size={24} />
              </div>
              <GlassBadge color="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{major}</GlassBadge>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-white">{studentName || user?.displayName || 'Student'}</h3>
              <p className="text-white/40 font-mono tracking-tighter text-sm">{studentId}</p>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-white/60 text-sm">{user?.email}</p>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <p className="text-emerald-400 text-sm font-semibold">{attendance}% Attendance</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="p-6 h-full flex flex-col bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Award className="text-emerald-400" size={24} />
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Cumulative GPA</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{gpa.toFixed(2)}</span>
                <span className="text-white/40 text-lg font-medium">/ 4.0</span>
              </div>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(gpa / 4) * 100}%` }} />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="p-6 h-full flex flex-col border-emerald-500/30">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <GraduationCap className="text-emerald-400" size={24} />
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Total Credits</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{totalCredits}</span>
                <span className="text-white/40 text-sm">Completed</span>
              </div>
              <p className="text-emerald-400/80 text-xs mt-3 flex items-center gap-1 font-medium">
                <CheckCircle2 size={12} /> On track for graduation
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

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

      <section className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-emerald-400" size={20} />
              <SectionTitle className="!mb-0">Important Dates (Myanmar 2026)</SectionTitle>
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