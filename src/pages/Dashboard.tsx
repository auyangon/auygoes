import React, { useEffect } from 'react';
import { Announcements } from '../components/Announcements';
import { useAuth } from '../contexts/AuthContext';
import { Announcements } from '../components/Announcements';
import { useData } from '../contexts/DataContext';
import { Announcements } from '../components/Announcements';
import { useNavigate } from 'react-router-dom';
import { Announcements } from '../components/Announcements';
import { MainLayout } from '../components/MainLayout';
import { Announcements } from '../components/Announcements';
import { Card, StatCard, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { Announcements } from '../components/Announcements';
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
  Sparkles
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
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#faf7f2'
      }}>
        <div className="text-center animate-scaleIn">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#0B4F3A]/20 border-t-[#0B4F3A] rounded-full animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="text-[#0B4F3A] animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#faf7f2'
      }}>
        <Card className="p-8 max-w-md text-center animate-scaleIn">
          <AlertCircle className="mx-auto mb-4 text-red-500 animate-bounce" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#0B4F3A] text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
          >
            Go to Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Welcome Section with Sparkles */}
      <div className="mb-8 animate-fadeInDown">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] rounded-xl animate-scalePulse">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] bg-clip-text text-transparent">
              Welcome back, {studentName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-500 mt-1">Here's your academic overview for Spring 2026</p>
          </div>
        </div>
      </div>

      {/* Stats Cards with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-children">
        <StatCard 
          icon={<TrendingUp size={24} />}
          value={gpa.toFixed(2)}
          label="Current GPA"
        />
        <StatCard 
          icon={<BookOpen size={24} />}
          value={totalCredits}
          label="Total Credits"
        />
        <StatCard 
          icon={<Users size={24} />}
          value={courses.length}
          label="Enrolled Courses"
        />
        <StatCard 
          icon={<Award size={24} />}
          value={`${attendance}%`}
          label="Attendance Rate"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Announcements Column */}
        <div className="lg:col-span-2 animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
          <SectionTitle icon={<Bell size={20} className="text-[#0B4F3A]" />}>
            Latest Announcements
          </SectionTitle>
          <Card 
            className="p-6 cursor-pointer hover:shadow-2xl transition-all group hover:-translate-y-1" 
            onClick={() => navigate('/announcements')}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[#e0f2fe] to-[#d1e9fd] hover:from-[#d1e9fd] hover:to-[#c0e0fc] transition-all transform hover:scale-[1.02]">
                <div className="p-2 rounded-full bg-[#0B4F3A] text-white shadow-lg group-hover:rotate-12 transition-transform">
                  <Bell size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">🏫 Thingyan Holiday</h4>
                  <p className="text-gray-600 text-sm">University closed March 30 - April 4</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Admin • 2 days ago</p>
                </div>
                <Badge variant="primary" className="animate-pulse">New</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-[#e0f2fe] to-[#d1e9fd] hover:from-[#d1e9fd] hover:to-[#c0e0fc] transition-all transform hover:scale-[1.02]">
                <div className="p-2 rounded-full bg-[#0B4F3A] text-white shadow-lg group-hover:rotate-12 transition-transform">
                  <GraduationCap size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">📝 Final Exam Schedule</h4>
                  <p className="text-gray-600 text-sm">The final examination schedule for May 2026 has been published.</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Academic Office • 5 days ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-200 group">
                <span className="text-sm text-gray-500">View all announcements</span>
                <ChevronRight size={16} className="text-[#0B4F3A] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar Column */}
        <div className="animate-fadeInRight" style={{ animationDelay: '0.3s' }}>
          <SectionTitle icon={<Calendar size={20} className="text-[#0B4F3A]" />}>
            Myanmar Calendar 2026
          </SectionTitle>
          <CalendarWidget />
        </div>
      </div>

      {/* Courses Section */}
      <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
        <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
          My Courses
        </SectionTitle>
        <Card className="p-6">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-gray-300 mb-4 animate-float" size={48} />
              <p className="text-gray-400">No courses found for Spring 2026</p>
            </div>
          ) : (
            <div className="space-y-4 stagger-children">
              {courses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#e0f2fe] to-[#d1e9fd] hover:from-[#d1e9fd] hover:to-[#c0e0fc] transition-all transform hover:scale-[1.01] hover:shadow-lg group"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#0B4F3A] text-white shadow-md group-hover:rotate-6 transition-transform">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <p className="text-sm text-gray-500">{course.courseId} • {course.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Credits</div>
                      <div className="font-semibold text-gray-800">{course.credits}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Grade</div>
                      <Badge variant={
                        course.grade?.startsWith('A') ? 'success' :
                        course.grade?.startsWith('B') ? 'primary' : 'default'
                      }>
                        {course.grade || '-'}
                      </Badge>
                    </div>
                    <div className="w-32">
                      <div className="text-sm text-gray-400 mb-1">Attendance</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{course.attendancePercentage || 0}%</span>
                        <ProgressBar value={course.attendancePercentage || 0} className="flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

