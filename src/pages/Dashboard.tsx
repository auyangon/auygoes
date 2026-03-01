import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, StatCard, SectionTitle, Badge, ProgressBar, Button } from '../components/Common';
import {
  TrendingUp,
  BookOpen,
  Award,
  Bell,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Calendar,
  Smile,
  Coffee,
  Sun,
  Moon,
  Star
} from 'lucide-react';

// Array of fun greetings
const greetings = [
  { emoji: '✨', text: 'Hey superstar!' },
  { emoji: '🌟', text: 'Welcome back, champ!' },
  { emoji: '🎓', text: 'Ready to learn?' },
  { emoji: '🚀', text: 'Let\'s soar high!' },
  { emoji: '💫', text: 'You\'re doing great!' },
  { emoji: '⭐', text: 'Another day, another win!' },
  { emoji: '🌈', text: 'Make today awesome!' },
  { emoji: '🦄', text: 'You\'re one of a kind!' },
];

// Time‑based greetings
const timeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { emoji: '☀️', text: 'Good morning' };
  if (hour < 18) return { emoji: '⛅', text: 'Good afternoon' };
  return { emoji: '🌙', text: 'Good evening' };
};

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, announcements, loading, error, gpa, totalCredits, attendance, studentName } = useData();
  const navigate = useNavigate();
  const [funGreeting, setFunGreeting] = useState(() => {
    const random = greetings[Math.floor(Math.random() * greetings.length)];
    const time = timeGreeting();
    return `${time.emoji} ${time.text}, ${random.emoji} ${random.text}`;
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (loading) return <LoadingFallback />;
  if (error) return <ErrorFallback error={error} />;

  return (
    <MainLayout>
      {/* Fun welcome banner */}
      <div className="mb-8 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
        <Sparkles className="text-yellow-300" size={32} />
        <div>
          <h1 className="text-3xl font-light text-white">{funGreeting}</h1>
          <p className="text-white/70 text-sm mt-1">{studentName || user?.email?.split('@')[0]}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={24} />} value={gpa.toFixed(2)} label="GPA" />
        <StatCard icon={<BookOpen size={24} />} value={totalCredits} label="Credits" />
        <StatCard icon={<GraduationCap size={24} />} value={courses.length} label="Courses" />
        <StatCard icon={<Award size={24} />} value={`${attendance}%`} label="Attendance" />
      </div>

      {/* Announcements & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Announcements */}
        <div className="lg:col-span-2">
          <SectionTitle icon={<Bell size={18} />}>Latest Announcements</SectionTitle>
          <Card className="p-5 space-y-4">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="border-b border-white/20 last:border-0 pb-3 last:pb-0">
                <h3 className="text-white font-light mb-1">{ann.title}</h3>
                <p className="text-white/70 text-sm mb-2">{ann.content}</p>
                <p className="text-white/50 text-xs">{ann.date} · {ann.author}</p>
              </div>
            ))}
            {announcements.length > 3 && (
              <div className="text-right">
                <Link to="/announcements" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-1">
                  View all <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Mini Calendar / Upcoming */}
        <div>
          <SectionTitle icon={<Calendar size={18} />}>Upcoming</SectionTitle>
          <Card className="p-5">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">15</div>
                <span className="text-white/80">Midterms begin</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">30</div>
                <span className="text-white/80">Thingyan holiday</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Course Previews */}
      <SectionTitle icon={<BookOpen size={18} />}>My Courses</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.slice(0, 3).map(course => (
          <Card key={course.id} className="p-5 cursor-pointer hover:scale-[1.02] transition" onClick={() => navigate(`/course/${course.courseId}`)}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-white font-light">{course.name}</h3>
              <Badge variant="primary">{course.courseId}</Badge>
            </div>
            <p className="text-white/70 text-sm mb-3">{course.teacher}</p>
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Credits: {course.credits}</span>
              <span>Grade: {course.grade || '—'}</span>
            </div>
            <div className="pt-3 border-t border-white/20">
              <div className="flex justify-between text-xs text-white/50 mb-1">
                <span>Attendance</span>
                <span>{course.attendancePercentage}%</span>
              </div>
              <ProgressBar value={course.attendancePercentage || 0} />
            </div>
          </Card>
        ))}
      </div>
      {courses.length > 3 && (
        <div className="text-right mt-4">
          <Link to="/courses" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-1">
            View all courses <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </MainLayout>
  );
}

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f]">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <GraduationCap className="absolute inset-0 m-auto text-white animate-pulse" size={24} />
      </div>
      <p className="text-white/80">Loading your dashboard...</p>
    </div>
  </div>
);

// Error fallback
const ErrorFallback = ({ error }: { error: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f]">
    <Card className="p-8 max-w-md text-center">
      <p className="text-red-300 mb-4">{error}</p>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </Card>
  </div>
);
