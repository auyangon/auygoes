import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/Common';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Bell,
  GraduationCap,
  Sparkles,
  Calendar
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
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0B4F3A] bg-opacity-10 rounded-lg">
              <TrendingUp className="text-[#0B4F3A]" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{gpa.toFixed(2)}</p>
              <p className="text-sm text-gray-500">GPA</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0B4F3A] bg-opacity-10 rounded-lg">
              <BookOpen className="text-[#0B4F3A]" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{totalCredits}</p>
              <p className="text-sm text-gray-500">Credits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0B4F3A] bg-opacity-10 rounded-lg">
              <GraduationCap className="text-[#0B4F3A]" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{courses.length}</p>
              <p className="text-sm text-gray-500">Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0B4F3A] bg-opacity-10 rounded-lg">
              <Award className="text-[#0B4F3A]" size={24} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">{attendance}%</p>
              <p className="text-sm text-gray-500">Attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Bell size={20} className="text-[#0B4F3A]" />
        Latest Announcements
      </h2>
      
      <div className="space-y-4 mb-8">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">{ann.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{ann.content}</p>
            <p className="text-xs text-gray-400">{ann.date} · {ann.author}</p>
          </div>
        ))}
      </div>

      {/* Courses */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BookOpen size={20} className="text-[#0B4F3A]" />
        My Courses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/course/${course.courseId}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800">{course.name}</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {course.courseId}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{course.teacher}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Credits: {course.credits}</span>
              <span className="font-medium text-[#0B4F3A]">Grade: {course.grade || '-'}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Attendance</span>
                <span className="text-sm font-medium text-[#0B4F3A]">{course.attendancePercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                <div 
                  className="h-full bg-[#0B4F3A] rounded-full"
                  style={{ width: `${course.attendancePercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
