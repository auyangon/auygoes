import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle, GlassBadge } from '../components/Common';
import { 
  User, 
  Award, 
  GraduationCap, 
  BookMarked, 
  ArrowUpRight, 
  CheckCircle2, 
  Calendar, 
  Megaphone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';

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
    courses = [], 
    gpa = 0, 
    totalCredits = 0, 
    attendance = 0, 
    studentName = '', 
    studentId = '', 
    major = '', 
    loading = true,
    announcements = []
  } = useData();

  // Safe values with fallbacks
  const displayName = studentName || user?.displayName || 'Student';
  const displayEmail = user?.email || 'student@auy.edu.mm';
  const displayMajor = major || 'Computer Science';
  const displayId = studentId || 'AUY-2025-001';
  const displayGpa = typeof gpa === 'number' && !isNaN(gpa) ? gpa : 3.5;
  const displayCredits = typeof totalCredits === 'number' && !isNaN(totalCredits) ? totalCredits : 45;
  const displayAttendance = typeof attendance === 'number' && !isNaN(attendance) ? attendance : 92;
  const totalRequiredCredits = 120;
  const progressPercent = Math.min(100, Math.round((displayCredits / totalRequiredCredits) * 100));

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <Coffee className="text-emerald-300" size={24} /> };
    if (hour < 18) return { text: "Good afternoon", icon: <Sun className="text-emerald-300" size={24} /> };
    return { text: "Good evening", icon: <Moon className="text-emerald-300" size={24} /> };
  };

  const greeting = getGreeting();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl">
              {greeting.icon}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1 flex items-center gap-2">
                {greeting.text}, {displayName.split(' ')[0]}
                <Sparkles className="text-emerald-400" size={24} />
              </h2>
              <div className="flex items-center gap-3 text-white/60">
                <Mail size={14} />
                <span className="text-sm">{displayEmail}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <MapPin size={14} />
                <span className="text-sm">Yangon</span>
              </div>
            </div>
          </div>
          
          <GlassBadge color="bg-emerald-500/20 text-emerald-300 border-emerald-500/30" className="text-base px-4 py-2">
            ID: {displayId}
          </GlassBadge>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student Profile Card */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-full flex flex-col bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-2xl">
                  <User className="text-emerald-400" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white">{displayName}</h3>
                  <p className="text-emerald-400 font-medium">{displayMajor}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2 text-white/60">
                      <Mail size={14} />
                      <span className="text-xs truncate">{displayEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Globe size={14} />
                      <span className="text-xs">Year 2</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-2 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{courses.length}</p>
                  <p className="text-xs text-white/40">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{displayCredits}</p>
                  <p className="text-xs text-white/40">Credits</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{displayAttendance}%</p>
                  <p className="text-xs text-white/40">Attendance</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* GPA Card */}
          <div>
            <GlassCard className="p-6 h-full flex flex-col bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <Award className="text-emerald-400" size={24} />
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Current GPA</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{displayGpa.toFixed(2)}</span>
                  <span className="text-white/40 text-lg font-medium">/ 4.0</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" 
                    style={{ width: ${(displayGpa / 4) * 100}% }}
                  />
                </div>
                <p className="text-emerald-400/80 text-xs mt-2">Dean's List eligible</p>
              </div>
            </GlassCard>
          </div>

          {/* Credits Card */}
          <div>
            <GlassCard className="p-6 h-full flex flex-col border-emerald-500/30">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-500/20 rounded-2xl">
                  <GraduationCap className="text-emerald-400" size={24} />
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{displayCredits}</span>
                  <span className="text-white/40 text-sm">/ {totalRequiredCredits}</span>
                </div>
                <p className="text-emerald-400/80 text-xs mt-3 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={12} /> {progressPercent}% Complete
                </p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Current Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <SectionTitle className="text-emerald-400">My Courses ({courses.length})</SectionTitle>
            <button className="text-emerald-400 text-sm font-medium flex items-center gap-1 hover:underline decoration-2">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.slice(0, 4).map((course, idx) => (
                <GlassCard key={course?.courseId || idx} className="p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer border-emerald-500/20 hover:border-emerald-500/40">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <BookMarked className="text-emerald-400" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{course?.name || 'Course Name'}</h4>
                    <p className="text-xs text-white/40 truncate">
                      {course?.courseId || 'CS101'} • {course?.credits || 3} Credits
                    </p>
                    {course?.teacherName && (
                      <p className="text-xs text-emerald-400/60 mt-1">{course.teacherName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold text-lg">{course?.grade || '—'}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <p className="text-white/60">No courses enrolled yet</p>
            </GlassCard>
          )}
        </section>

        {/* Calendar & Announcements */}
        <section className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Card */}
            <GlassCard className="p-6 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-emerald-400" size={20} />
                <SectionTitle className="!mb-0 text-emerald-400">Important Dates 2026</SectionTitle>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {importantDates.map((monthData, idx) => (
                  <div key={idx} className="border-b border-emerald-500/10 pb-2 last:border-0">
                    <h4 className="text-white font-semibold">{monthData.month}</h4>
                    <p className="text-emerald-400/80 text-sm">Days: {monthData.days.join(', ')}</p>
                    <p className="text-white/60 text-xs">{monthData.name}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Announcements Card */}
            <GlassCard className="p-6 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="text-emerald-400" size={20} />
                <SectionTitle className="!mb-0 text-emerald-400">Announcements</SectionTitle>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {announcements.length > 0 ? (
                  announcements.map((ann, idx) => (
                    <div key={idx} className="border-b border-emerald-500/10 pb-3 last:border-0">
                      <h4 className="text-white font-medium text-sm">{ann?.title || 'Announcement'}</h4>
                      <p className="text-white/60 text-xs mt-1">{ann?.content || 'No content'}</p>
                      <p className="text-emerald-400/60 text-xs mt-1">{ann?.date || '2024-01-01'}</p>
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
    </div>
  );
};
