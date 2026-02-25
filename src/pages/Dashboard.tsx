import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, GlassBadge } from '../components/Common';
import { User, Award, GraduationCap, BookMarked, ArrowUpRight, CheckCircle2, Calendar, Megaphone } from 'lucide-react';

// Hardcoded Myanmar 2026 holidays
const importantDates = [
  { month: 'January', days: [1, 2, 3, 4], name: 'New Year & Independence Day' },
  { month: 'February', days: [12, 13, 16, 17], name: 'Union Day & Chinese New Year' },
  { month: 'March', days: [2, 27, 28], name: 'Peasants Day & Armed Forces Day' },
  { month: 'April', days: [11, 12, 13, 14, 15, 16, 17, 18, 19, 30], name: 'Thingyan & New Year' },
  { month: 'May', days: [1, 27], name: 'Labour Day & Eid' },
  { month: 'July', days: [19, 29], name: 'Martyrs Day & Waso' },
  { month: 'October', days: [24, 25, 26, 27], name: 'Thadingyut' },
  { month: 'November', days: [8, 21, 22, 23, 24], name: 'Deepavali & Tazaungmone' },
  { month: 'December', days: [4, 5, 25, 26], name: 'National Day & Christmas' },
];

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

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">
          Hello, {studentName ? studentName.split(' ')[0] : 'Student'}
        </h2>
        <p className="text-white/60">Welcome to American University of Yangon.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Student info card */}
        <div className="lg:col-span-2">
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
        </div>

        {/* GPA card */}
        <div>
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
        </div>

        {/* Credits card */}
        <div>
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
        </div>
      </div>

      {/* Current Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <SectionTitle>Current Courses</SectionTitle>
          <button className="text-emerald-400 text-sm font-medium flex items-center gap-1 hover:underline decoration-2">
            View all <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 4).map((course, idx) => (
            <GlassCard key={course.courseId} className="p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer">
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
              <SectionTitle className="!mb-0">Important Dates (Myanmar 2026)</SectionTitle>
            </div>
            <div className="space-y-4">
              {importantDates.map((monthData, idx) => (
                <div key={idx} className="border-b border-white/10 pb-2 last:border-0">
                  <h4 className="text-white font-semibold">{monthData.month}</h4>
                  <p className="text-emerald-400/80 text-sm">Days: {monthData.days.join(', ')}</p>
                  <p className="text-white/60 text-xs">{monthData.name}</p>
                </div>
              ))}
            </div>
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

          {/* Announcements Card */}
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