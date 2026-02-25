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
  Bell,
  Star,
  Clock,
  Cloud,
  DollarSign,
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

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <Coffee className="text-tiffany-300" size={24} /> };
    if (hour < 18) return { text: "Good afternoon", icon: <Sun className="text-tiffany-300" size={24} /> };
    return { text: "Good evening", icon: <Moon className="text-tiffany-300" size={24} /> };
  };

  const greeting = getGreeting();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-seafoam-900 to-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-tiffany-500/20 border-t-tiffany-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-seafoam-900 via-emerald-900 to-teal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header with Tiffany accent */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-tiffany-500/20 to-seafoam-500/20 rounded-2xl">
              {greeting.icon}
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-1 flex items-center gap-2">
                {greeting.text}, {studentName ? studentName.split(' ')[0] : 'Student'}
                <Sparkles className="text-tiffany-400" size={24} />
              </h2>
              <p className="text-white/60">American University of Yangon</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition">
              <Bell size={20} className="text-tiffany-400" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-tiffany-500 to-seafoam-500"></div>
          </div>
        </header>

        {/* Stats Cards with Seafoam/Tiffany theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Student info card */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-full flex flex-col justify-between bg-gradient-to-br from-tiffany-500/10 to-seafoam-500/10 border-tiffany-500/20">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-gradient-to-br from-tiffany-500/30 to-seafoam-500/30 rounded-2xl">
                  <User className="text-tiffany-400" size={24} />
                </div>
                <GlassBadge color="bg-tiffany-500/20 text-tiffany-300 border-tiffany-500/30">
                  {major}
                </GlassBadge>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white">{studentName || user?.displayName || 'Student'}</h3>
                <p className="text-white/40 font-mono tracking-tighter text-sm">{studentId}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-white/60 text-sm">{user?.email}</p>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <p className="text-tiffany-400 text-sm font-semibold">{attendance}% Attendance</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* GPA card */}
          <div>
            <GlassCard className="p-6 h-full flex flex-col bg-gradient-to-br from-tiffany-500/20 to-seafoam-500/10 border-tiffany-500/20">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-tiffany-500/20 rounded-2xl">
                  <Award className="text-tiffany-400" size={24} />
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Cumulative GPA</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{gpa.toFixed(2)}</span>
                  <span className="text-white/40 text-lg font-medium">/ 4.0</span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-tiffany-400 to-seafoam-400 rounded-full" style={{ width: `${(gpa / 4) * 100}%` }} />
                </div>
                <p className="text-tiffany-400/80 text-xs mt-2">Keep shining! ✨</p>
              </div>
            </GlassCard>
          </div>

          {/* Credits card */}
          <div>
            <GlassCard className="p-6 h-full flex flex-col border-tiffany-500/30">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-tiffany-500/20 rounded-2xl">
                  <GraduationCap className="text-tiffany-400" size={24} />
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">Total Credits</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{totalCredits}</span>
                  <span className="text-white/40 text-sm">Completed</span>
                </div>
                <p className="text-tiffany-400/80 text-xs mt-3 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={12} /> On track for graduation
                </p>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Current Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <SectionTitle className="text-tiffany-400">Current Courses</SectionTitle>
            <button className="text-tiffany-400 text-sm font-medium flex items-center gap-1 hover:underline decoration-2">
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.slice(0, 4).map((course, idx) => (
              <GlassCard key={course.courseId} className="p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer border-tiffany-500/20 hover:border-tiffany-500/40">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tiffany-500/20 to-seafoam-500/20 border border-tiffany-500/30 flex items-center justify-center shrink-0">
                  <BookMarked className="text-tiffany-400" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{course.name}</h4>
                  <p className="text-xs text-white/40 truncate">{course.courseId} • {course.credits} Credits</p>
                </div>
                <div className="text-right">
                  <div className="text-tiffany-400 font-bold text-lg">{course.grade || '-'}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Calendar & Announcements with Tiffany theme */}
        <section className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Card */}
            <GlassCard className="p-6 border-tiffany-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-tiffany-400" size={20} />
                <SectionTitle className="!mb-0 text-tiffany-400">Important Dates (Myanmar 2026)</SectionTitle>
              </div>
              <div className="space-y-4">
                {importantDates.map((monthData, idx) => (
                  <div key={idx} className="border-b border-tiffany-500/10 pb-2 last:border-0">
                    <h4 className="text-white font-semibold">{monthData.month}</h4>
                    <p className="text-tiffany-400/80 text-sm">Days: {monthData.days.join(', ')}</p>
                    <p className="text-white/60 text-xs">{monthData.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-tiffany-500/10">
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-tiffany-500/30 ring-2 ring-tiffany-500/50" />
                    <span className="text-white/60">Public Holiday</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-seafoam-500/30 ring-2 ring-seafoam-500/50" />
                    <span className="text-white/60">Academic Event</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Announcements Card */}
            <GlassCard className="p-6 border-tiffany-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="text-tiffany-400" size={20} />
                <SectionTitle className="!mb-0 text-tiffany-400">Announcements</SectionTitle>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {announcements.length > 0 ? (
                  announcements.map((ann, idx) => (
                    <div key={idx} className="border-b border-tiffany-500/10 pb-3 last:border-0 last:pb-0">
                      <h4 className="text-white font-medium text-sm">{ann.title}</h4>
                      <p className="text-white/60 text-xs mt-1 line-clamp-2">{ann.content}</p>
                      <p className="text-tiffany-400/60 text-xs mt-1">{ann.date}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/40 text-sm">No announcements at this time.</p>
                )}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Tiffany accent widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <GlassCard className="p-4 flex items-center gap-3 border-tiffany-500/20">
            <div className="p-2 bg-tiffany-500/20 rounded-lg">
              <Clock size={20} className="text-tiffany-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Next event</p>
              <p className="text-white font-semibold">Midterm Exams (Apr 6-10)</p>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3 border-tiffany-500/20">
            <div className="p-2 bg-tiffany-500/20 rounded-lg">
              <TrendingUp size={20} className="text-tiffany-400" />
            </div>
            <div>
              <p className="text-sm text-white/60">Academic standing</p>
              <p className="text-white font-semibold">Good standing</p>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3 border-tiffany-500/20">
            <div className="p-2 bg-tiffany-500/20 rounded-lg">
              <Star size={20} className="text-tiffany-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm text-white/60">Achievement</p>
              <p className="text-white font-semibold">Dean's List eligible</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};