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
  Sparkles,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, loading, error, gpa, totalCredits, attendance, studentName, attendanceRecords } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#faf7f2' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#0B4F3A]/20 border-t-[#0B4F3A] rounded-full animate-spin mx-auto mb-6" />
            <GraduationCap className="absolute inset-0 m-auto text-[#0B4F3A] animate-pulse" size={24} />
          </div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#faf7f2' }} className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#0B4F3A] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </Card>
      </div>
    );
  }

  // Calculate today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayClasses = attendanceRecords.filter(a => a.date === today);
  const presentToday = todayClasses.filter(a => a.status === 'present').length;
  const lateToday = todayClasses.filter(a => a.status === 'late').length;

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] rounded-xl animate-pulse">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0B4F3A]">
              Welcome back, {studentName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-500 mt-1">Real-time data • Auto-sync from Google Sheets</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<TrendingUp size={24} />} value={gpa.toFixed(2)} label="GPA" />
        <StatCard icon={<BookOpen size={24} />} value={totalCredits} label="Credits" />
        <StatCard icon={<Users size={24} />} value={courses.length} label="Courses" />
        <StatCard icon={<Award size={24} />} value={`${attendance}%`} label="Overall Attendance" />
        <StatCard icon={<Clock size={24} />} value={`${presentToday}/${todayClasses.length}`} label="Today's Classes" />
      </div>

      {/* Today's Attendance Summary */}
      {todayClasses.length > 0 && (
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">Today's Attendance</h3>
            <span className="text-sm text-gray-500">{today}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{presentToday}</div>
              <div className="text-xs text-gray-500">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{lateToday}</div>
              <div className="text-xs text-gray-500">Late</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{todayClasses.length - presentToday - lateToday}</div>
              <div className="text-xs text-gray-500">Absent</div>
            </div>
          </div>
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SectionTitle icon={<Bell size={20} className="text-[#0B4F3A]" />}>
            Latest Announcements
          </SectionTitle>
          <Announcements />
        </div>
        <div>
          <SectionTitle icon={<Calendar size={20} className="text-[#0B4F3A]" />}>
            Myanmar Calendar 2026
          </SectionTitle>
          <CalendarWidget />
        </div>
      </div>

      {/* Courses Section with Attendance */}
      <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
        My Courses
      </SectionTitle>
      
      <div className="space-y-4">
        {courses.map((course) => {
          const courseAttendance = attendanceRecords.filter(a => a.courseId === course.courseId);
          const recentAttendance = courseAttendance.slice(0, 3);
          
          return (
            <Card 
              key={course.id} 
              className="p-4 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/course/${course.courseId}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0B4F3A] text-white rounded-lg">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.name}</h3>
                    <p className="text-sm text-gray-500">{course.courseId} • {course.teacher}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right min-w-[60px]">
                    <div className="text-sm text-gray-400">Grade</div>
                    <Badge variant={course.grade?.startsWith('A') ? 'success' : 'primary'}>
                      {course.grade || '-'}
                    </Badge>
                  </div>
                  
                  <div className="w-32">
                    <div className="text-sm text-gray-400 mb-1">Attendance</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{course.attendancePercentage}%</span>
                      <ProgressBar value={course.attendancePercentage || 0} className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Attendance Preview */}
              {recentAttendance.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400">Recent:</span>
                    {recentAttendance.map((record, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        {record.status === 'present' && <CheckCircle size={12} className="text-green-500" />}
                        {record.status === 'late' && <Clock size={12} className="text-yellow-500" />}
                        {record.status === 'absent' && <XCircle size={12} className="text-red-500" />}
                        <span className="text-gray-600">
                          {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </MainLayout>
  );
}
