import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
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
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f0ff 35%, #fff5e6 70%, #f0f7ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
          `}</style>
          <div className="animate-float">
            <div style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(236, 72, 153, 0.2)',
              borderTop: '3px solid #ec4899',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
              boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.2)'
            }}></div>
          </div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
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
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f0ff 35%, #fff5e6 70%, #f0f7ff 100%)'
      }}>
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-pink-400" size={48} />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Return to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Welcome Section with Sparkles */}
      <div className="mb-8 flex items-center gap-3">
        <Sparkles className="text-pink-400" size={24} />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
            Welcome back, {studentName || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">Here's your academic overview for Spring 2026</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<TrendingUp size={24} />}
          value={gpa.toFixed(2)}
          label="Current GPA"
          gradient="from-pink-400 to-purple-400"
        />
        <StatCard 
          icon={<BookOpen size={24} />}
          value={totalCredits}
          label="Total Credits"
          gradient="from-purple-400 to-indigo-400"
        />
        <StatCard 
          icon={<Users size={24} />}
          value={courses.length}
          label="Enrolled Courses"
          gradient="from-indigo-400 to-blue-400"
        />
        <StatCard 
          icon={<Award size={24} />}
          value={`${attendance}%`}
          label="Attendance Rate"
          gradient="from-blue-400 to-cyan-400"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Announcements Column */}
        <div className="lg:col-span-2">
          <SectionTitle icon={<Bell size={20} className="text-pink-400" />}>
            Latest Announcements
          </SectionTitle>
          <Card 
            className="p-6 cursor-pointer hover:shadow-xl transition-all" 
            onClick={() => navigate('/announcements')}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 transition-all">
                <div className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md">
                  <Bell size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-700">🏫 Thingyan Holiday</h4>
                  <p className="text-gray-500 text-sm">University closed March 30 - April 4</p>
                  <p className="text-gray-400 text-xs mt-2">Posted by Admin • 2 days ago</p>
                </div>
                <Badge variant="pastel">New</Badge>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all">
                <div className="p-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 text-white shadow-md">
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
                <ChevronRight size={16} className="text-pink-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Calendar Column */}
        <div>
          <SectionTitle icon={<Calendar size={20} className="text-purple-400" />}>
            Upcoming Dates
          </SectionTitle>
          <CalendarWidget />
        </div>
      </div>

      {/* Courses Section */}
      <SectionTitle icon={<BookOpen size={20} className="text-indigo-400" />}>
        My Courses
      </SectionTitle>
      <Card className="p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-medium">No courses found for Spring 2026</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, index) => {
              const gradients = [
                'from-pink-50 to-purple-50',
                'from-purple-50 to-indigo-50',
                'from-indigo-50 to-blue-50',
                'from-blue-50 to-cyan-50',
                'from-cyan-50 to-teal-50',
                'from-teal-50 to-green-50'
              ];
              const iconGradients = [
                'from-pink-400 to-purple-400',
                'from-purple-400 to-indigo-400',
                'from-indigo-400 to-blue-400',
                'from-blue-400 to-cyan-400',
                'from-cyan-400 to-teal-400',
                'from-teal-400 to-green-400'
              ];
              const gradientIndex = index % gradients.length;
              
              return (
                <div key={course.id} className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${gradients[gradientIndex]} hover:shadow-md transition-all`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${iconGradients[gradientIndex]} text-white shadow-md`}>
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
                        course.grade?.startsWith('B') ? 'primary' : 'pastel'
                      }>
                        {course.grade || '-'}
                      </Badge>
                    </div>
                    <div className="w-32">
                      <div className="text-sm text-gray-400 mb-1">Attendance</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">{course.attendancePercentage || 0}%</span>
                        <ProgressBar 
                          value={course.attendancePercentage || 0} 
                          gradient={iconGradients[gradientIndex]}
                          className="flex-1" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </MainLayout>
  );
}
