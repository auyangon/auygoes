import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge, ProgressBar } from '../components/Common';
import {
  TrendingUp,
  BookOpen,
  Award,
  Bell,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 20) return 'Good evening';
  return 'Good night';
};

const getGreetingEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '🌅';
  if (hour < 17) return '☀️';
  if (hour < 20) return '🌆';
  return '🌙';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    courses, 
    announcements, 
    loading, 
    error, 
    gpa, 
    totalCredits, 
    attendance, 
    studentName, 
    studentEmail,
    studentId,
    major 
  } = useData();
  
  const navigate = useNavigate();
  const greeting = getGreeting();
  const emoji = getGreetingEmoji();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Debug logs
  useEffect(() => {
    console.log('📊 Dashboard received:', {
      studentName,
      studentEmail,
      studentId,
      major,
      courses: courses.length,
      gpa,
      totalCredits,
      attendance
    });
  }, [studentName, studentEmail, studentId, major, courses, gpa, totalCredits, attendance]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e8f3f0] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <GraduationCap className="absolute inset-0 m-auto text-[#2E8B57]" size={32} />
          </div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e8f3f0] flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#2E8B57] text-white rounded-xl hover:bg-[#3CB371] transition-all shadow-lg"
          >
            Go to Login
          </button>
        </Card>
      </div>
    );
  }

  // Use studentName if available, otherwise fallback to email username
  const displayName = studentName || (user?.email ? user.email.split('@')[0].split('.').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ') : 'Student');

  return (
    <MainLayout>
      {/* Welcome Banner */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2E8B57] to-[#66CDAA] p-8 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
            <span className="text-4xl">{emoji}</span>
          </div>
          <div>
            <h1 className="text-3xl font-light text-white mb-2">
              {greeting}, {displayName}!
            </h1>
            <p className="text-white/80 text-sm flex items-center gap-2">
              <Sparkles size={16} />
              Student ID: {studentId || 'N/A'} • {major || 'ISP Program'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] rounded-xl shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{gpa.toFixed(2)}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                GPA
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] rounded-xl shadow-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{totalCredits}</div>
              <div className="text-sm text-gray-500">Credits</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] rounded-xl shadow-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{courses.length}</div>
              <div className="text-sm text-gray-500">Courses</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#2E8B57] to-[#66CDAA] rounded-xl shadow-lg">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{attendance}%</div>
              <div className="text-sm text-gray-500">Attendance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Announcements */}
        <div className="lg:col-span-2">
          <SectionTitle icon={<Bell size={18} className="text-[#2E8B57]" />}>
            Latest Announcements
          </SectionTitle>
          <Card className="p-5">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="border-b border-gray-100 last:border-0 py-4 first:pt-0 last:pb-0 group hover:bg-gray-50/50 px-3 -mx-3 rounded-lg transition-all">
                <h3 className="font-medium text-gray-800 mb-1 group-hover:text-[#2E8B57] transition-colors">{ann.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{ann.content}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={12} />
                  <span>{formatDate(ann.date)}</span>
                  <span>•</span>
                  <span>{ann.author}</span>
                </div>
              </div>
            ))}
            {announcements.length > 3 && (
              <div className="text-right mt-3">
                <Link to="/announcements" className="text-sm text-[#2E8B57] hover:text-[#3CB371] transition-colors inline-flex items-center gap-1">
                  View all <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming */}
        <div>
          <SectionTitle icon={<Calendar size={18} className="text-[#2E8B57]" />}>
            Upcoming
          </SectionTitle>
          <Card className="p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center text-[#2E8B57] font-bold group-hover:bg-[#2E8B57] group-hover:text-white transition-all">15</div>
                <div>
                  <span className="text-gray-700 font-medium">Midterm exams begin</span>
                  <p className="text-xs text-gray-400">March 15, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center text-[#2E8B57] font-bold group-hover:bg-[#2E8B57] group-hover:text-white transition-all">30</div>
                <div>
                  <span className="text-gray-700 font-medium">Thingyan holiday</span>
                  <p className="text-xs text-gray-400">March 30, 2026</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Course Previews */}
      <SectionTitle icon={<BookOpen size={18} className="text-[#2E8B57]" />}>
        My Courses
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.slice(0, 3).map(course => (
          <Card 
            key={course.id} 
            className="p-5 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 group"
            onClick={() => navigate(`/course/${course.courseId}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800 group-hover:text-[#2E8B57] transition-colors">{course.name}</h3>
              <Badge variant="primary" className="bg-[#2E8B57] text-white">{course.courseId}</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-3">{course.teacher}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
              <span>Credits: {course.credits}</span>
              <span className="font-medium text-[#2E8B57]">Grade: {course.grade || '—'}</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Attendance</span>
                <span className="text-xs font-medium text-[#2E8B57]">{course.attendancePercentage}%</span>
              </div>
              <ProgressBar value={course.attendancePercentage || 0} />
            </div>
          </Card>
        ))}
      </div>
      {courses.length > 3 && (
        <div className="text-right mt-4">
          <Link to="/courses" className="text-sm text-[#2E8B57] hover:text-[#3CB371] transition-colors inline-flex items-center gap-1">
            View all courses <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
