import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, StatCard, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { CalendarWidget } from '../components/CalendarWidget';
import { 
  TrendingUp, 
  BookOpen, 
  Award, 
  Calendar, 
  Bell, 
  AlertCircle,
  Users,
  GraduationCap,
  ChevronRight
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(79, 70, 229, 0.2)',
            borderTop: '3px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}></div>
          <p className="text-gray-600 font-medium drop-shadow-sm">Loading your dashboard...</p>
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow-sm">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-md">
          Welcome back, {studentName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600 font-medium drop-shadow-sm">Here's your academic overview for Spring 2026</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Two Column Layout - Announcements and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Announcements Column - Takes 2/3 width */}
        <div className="lg:col-span-2">
          <SectionTitle icon={<Bell size={20} />}>Latest Announcements</SectionTitle>
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all" 
            onClick={() => navigate('/announcements')}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
                <div className="p-2 rounded-full bg-indigo-100">
                  <Bell size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 drop-shadow-sm">🏫 Thingyan Holiday</h4>
                  <p className="text-gray-600 text-sm">University closed March 30 - April 4</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Admin • 2 days ago</p>
                </div>
                <Badge variant="warning">New</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
                <div className="p-2 rounded-full bg-indigo-100">
                  <GraduationCap size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 drop-shadow-sm">📝 Final Exam Schedule</h4>
                  <p className="text-gray-600 text-sm">The final examination schedule for May 2026 has been published.</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Academic Office • 5 days ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">View all announcements</span>
                <ChevronRight size={16} className="text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar Column - Takes 1/3 width */}
        <div>
          <SectionTitle icon={<Calendar size={20} />}>Upcoming Dates</SectionTitle>
          <CalendarWidget />
        </div>
      </div>

      {/* Courses Section */}
      <SectionTitle icon={<BookOpen size={20} />}>My Courses</SectionTitle>
      <Card className="p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No courses found for Spring 2026</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 drop-shadow-sm">{course.name}</h4>
                    <p className="text-sm font-medium text-gray-600">{course.courseId} • {course.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Credits</div>
                    <div className="font-semibold text-gray-800 drop-shadow-sm">{course.credits}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Grade</div>
                    <Badge variant={
                      course.grade?.startsWith('A') ? 'success' :
                      course.grade?.startsWith('B') ? 'primary' : 'warning'
                    }>
                      {course.grade || '-'}
                    </Badge>
                  </div>
                  <div className="w-32">
                    <div className="text-sm font-medium text-gray-500 mb-1">Attendance</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800 drop-shadow-sm">{course.attendancePercentage || 0}%</span>
                      <ProgressBar value={course.attendancePercentage || 0} className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </MainLayout>
  );
}
