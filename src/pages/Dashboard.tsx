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
  Clock
} from 'lucide-react';

// Time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 20) return 'Good evening';
  return 'Good night';
};

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, announcements, loading, error, gpa, totalCredits, attendance, studentName } = useData();
  const navigate = useNavigate();
  const greeting = getGreeting();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <GraduationCap className="absolute inset-0 m-auto text-[#2E8B57]" size={24} />
          </div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#3CB371]"
          >
            Go to Login
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
          <div className="p-2 bg-[#2E8B57] bg-opacity-10 rounded-xl">
            <Sparkles className="text-[#2E8B57]" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {studentName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 text-sm mt-1">Here's your academic overview</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#2E8B57] bg-opacity-10 rounded-lg">
              <TrendingUp className="text-[#2E8B57]" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{gpa.toFixed(2)}</div>
              <div className="text-sm text-gray-600">GPA</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#2E8B57] bg-opacity-10 rounded-lg">
              <BookOpen className="text-[#2E8B57]" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalCredits}</div>
              <div className="text-sm text-gray-600">Credits</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#2E8B57] bg-opacity-10 rounded-lg">
              <GraduationCap className="text-[#2E8B57]" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
              <div className="text-sm text-gray-600">Courses</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#2E8B57] bg-opacity-10 rounded-lg">
              <Award className="text-[#2E8B57]" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{attendance}%</div>
              <div className="text-sm text-gray-600">Attendance</div>
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
              <div key={ann.id} className="border-b border-gray-100 last:border-0 py-3 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-1">{ann.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{ann.content}</p>
                <p className="text-gray-400 text-xs">{ann.date} · {ann.author}</p>
              </div>
            ))}
            {announcements.length > 3 && (
              <div className="text-right mt-3">
                <Link to="/announcements" className="text-sm text-[#2E8B57] hover:underline">
                  View all →
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
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2E8B57] bg-opacity-10 flex items-center justify-center text-[#2E8B57] font-medium">15</div>
                <span className="text-gray-700">Midterm exams begin</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2E8B57] bg-opacity-10 flex items-center justify-center text-[#2E8B57] font-medium">30</div>
                <span className="text-gray-700">Thingyan holiday</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Course Previews */}
      <SectionTitle icon={<BookOpen size={18} className="text-[#2E8B57]" />}>
        My Courses
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.slice(0, 3).map(course => (
          <Card 
            key={course.id} 
            className="p-5 cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/course/${course.courseId}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{course.name}</h3>
              <Badge variant="primary" className="bg-[#2E8B57] text-white">{course.courseId}</Badge>
            </div>
            <p className="text-gray-600 text-sm mb-3">{course.teacher}</p>
            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <span>Credits: {course.credits}</span>
              <span>Grade: {course.grade || '—'}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
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
          <Link to="/courses" className="text-sm text-[#2E8B57] hover:underline">
            View all courses →
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
