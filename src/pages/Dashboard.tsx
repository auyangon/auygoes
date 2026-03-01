import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, StatCard, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { CalendarWidget } from '../components/CalendarWidget';
import { Announcements } from '../components/Announcements';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Calendar, 
  Bell, 
  AlertCircle,
  Users,
  GraduationCap,
  ChevronRight,
  User
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, loading, error, gpa, totalCredits, attendance, studentName } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#0B4F3A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md text-center">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-[#0B4F3A] text-white rounded text-sm"
          >
            Go to Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-gray-800 mb-1">Welcome back, {studentName || user?.email?.split('@')[0]}!</h1>
        <p className="text-sm text-gray-500">Real-time data • Auto-sync from Google Sheets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<TrendingUp size={18} />} value={gpa.toFixed(2)} label="GPA" />
        <StatCard icon={<BookOpen size={18} />} value={totalCredits} label="Credits" />
        <StatCard icon={<Users size={18} />} value={courses.length} label="Courses" />
        <StatCard icon={<Award size={18} />} value={`${attendance}%`} label="Attendance" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Announcements */}
        <div className="md:col-span-2">
          <Announcements />
        </div>

        {/* Calendar */}
        <div>
          <CalendarWidget />
        </div>
      </div>

      {/* Courses */}
      <div className="mt-6">
        <SectionTitle icon={<BookOpen size={16} className="text-[#0B4F3A]" />}>
          My Courses
        </SectionTitle>
        
        <div className="space-y-2">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => navigate(`/course/${course.courseId}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen size={16} className="text-gray-400" />
                  <div>
                    <h4 className="text-gray-800 text-sm">{course.name}</h4>
                    <p className="text-xs text-gray-500">{course.courseId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Grade</div>
                    <div className="text-sm text-gray-700">{course.grade || '-'}</div>
                  </div>
                  <div className="w-20">
                    <div className="text-xs text-gray-400 mb-1">Attendance</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-700">{course.attendancePercentage}%</span>
                      <ProgressBar value={course.attendancePercentage || 0} className="flex-1" />
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
