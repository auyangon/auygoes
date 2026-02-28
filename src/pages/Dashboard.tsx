import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, StatCard, SectionTitle, Badge, ProgressBar, Button } from '../components/Common';
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
        backgroundColor: '#faf7f2'
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
            border: '3px solid rgba(11, 79, 58, 0.2)',
            borderTop: '3px solid #0B4F3A',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p className="text-gray-500">Loading your dashboard...</p>
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
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-[#0B4F3A]" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">
          Welcome back, {studentName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-500">Here's your academic overview for Spring 2026</p>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Announcements Column */}
        <div className="lg:col-span-2">
          <SectionTitle icon={<Bell size={20} className="text-[#0B4F3A]" />}>
            Latest Announcements
          </SectionTitle>
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all" 
            onClick={() => navigate('/announcements')}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#e0f2fe] hover:bg-[#d1e9fd] transition-all">
                <div className="p-2 rounded-full bg-[#0B4F3A] text-white">
                  <Bell size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-700">🏫 Thingyan Holiday</h4>
                  <p className="text-gray-500 text-sm">University closed March 30 - April 4</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Admin • 2 days ago</p>
                </div>
                <Badge variant="primary">New</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#e0f2fe] hover:bg-[#d1e9fd] transition-all">
                <div className="p-2 rounded-full bg-[#0B4F3A] text-white">
                  <GraduationCap size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-700">📝 Final Exam Schedule</h4>
                  <p className="text-gray-500 text-sm">The final examination schedule for May 2026 has been published.</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Academic Office • 5 days ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-400">View all announcements</span>
                <ChevronRight size={16} className="text-[#0B4F3A]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar Column */}
        <div>
          <SectionTitle icon={<Calendar size={20} className="text-[#0B4F3A]" />}>
            Upcoming Dates
          </SectionTitle>
          <CalendarWidget />
        </div>
      </div>

      {/* Courses Section */}
      <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
        My Courses
      </SectionTitle>
      <Card className="p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400">No courses found for Spring 2026</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-4 rounded-lg bg-[#e0f2fe] hover:bg-[#d1e9fd] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-[#0B4F3A] text-white">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700">{course.name}</h4>
                    <p className="text-sm text-gray-500">{course.courseId} • {course.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Credits</div>
                    <div className="font-semibold text-gray-700">{course.credits}</div>
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
                      <span className="text-sm font-semibold text-gray-700">{course.attendancePercentage || 0}%</span>
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
