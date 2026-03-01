// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, StatCard, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Bell,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, announcements, loading, error, gpa, totalCredits, attendance, studentName } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#0B4F3A]/20 border-t-[#0B4F3A] rounded-full animate-spin mx-auto mb-4" />
            <GraduationCap className="absolute inset-0 m-auto text-[#0B4F3A] animate-pulse" size={24} />
          </div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/verify')}
            className="px-4 py-2 bg-[#0B4F3A] text-white rounded-lg"
          >
            Check Data
          </button>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] rounded-xl">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0B4F3A]">
              Welcome back, {studentName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-500 mt-1">Real-time data from Google Sheets</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={24} />} value={gpa.toFixed(2)} label="GPA" />
        <StatCard icon={<BookOpen size={24} />} value={totalCredits} label="Credits" />
        <StatCard icon={<GraduationCap size={24} />} value={courses.length} label="Courses" />
        <StatCard icon={<Award size={24} />} value={`${attendance}%`} label="Attendance" />
      </div>

      {/* Announcements */}
      <SectionTitle icon={<Bell size={20} className="text-[#0B4F3A]" />}>
        Latest Announcements
      </SectionTitle>
      
      <div className="space-y-4 mb-8">
        {announcements.slice(0, 3).map((ann) => (
          <Card key={ann.id} className="p-5 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-800 mb-2">{ann.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{ann.content}</p>
            <p className="text-xs text-gray-400">{ann.date} · {ann.author}</p>
          </Card>
        ))}
        {announcements.length > 3 && (
          <div className="text-right">
            <Link to="/announcements" className="text-sm text-[#0B4F3A] hover:underline">
              View all announcements →
            </Link>
          </div>
        )}
      </div>

      {/* Courses Preview */}
      <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
        My Courses
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.slice(0, 3).map((course) => (
          <Card 
            key={course.id} 
            className="p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/course/${course.courseId}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800">{course.name}</h3>
              <Badge variant="primary" className="text-xs">{course.courseId}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{course.teacher}</p>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-gray-500">Credits: {course.credits}</span>
              <span className="font-medium text-[#0B4F3A]">Grade: {course.grade || '-'}</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Attendance</span>
                <span className="text-xs font-medium text-[#0B4F3A]">{course.attendancePercentage}%</span>
              </div>
              <ProgressBar value={course.attendancePercentage || 0} />
            </div>
          </Card>
        ))}
      </div>
      {courses.length > 3 && (
        <div className="text-right mt-4">
          <Link to="/courses" className="text-sm text-[#0B4F3A] hover:underline">
            View all courses →
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
