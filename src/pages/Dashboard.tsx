import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, Badge, ProgressBar } from '../components/Common';
import { 
  BookOpen, 
  Award, 
  GraduationCap, 
  Calendar, 
  Bell, 
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, attendance, studentName, studentId, major, loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-medium text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  // Get current time for greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";

  // Get student name - PRIORITY: studentName from Firebase > user.displayName > 'Student'
  const displayName = studentName || user?.displayName || "Student";
  const firstName = displayName.split(' ')[0];

  // Stat card gradients
  const statGradients = [
    'from-primary to-primary-light',
    'from-primary-light to-primary-soft',
    'from-primary-soft to-primary-lighter',
    'from-primary to-primary-soft'
  ];

  // Get grade color
  const getGradeColor = (grade: string) => {
    if (!grade) return 'bg-gray-100 text-gray-600';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="space-y-6">
      {/* Header with Student Name - NO BOLD, smaller font */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-normal text-gray-800">
              {greeting}, {firstName}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary">ID: {studentId || 'AUY-2025-001'}</Badge>
          <Badge>{major || 'ISP Program'}</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`stat-card bg-gradient-to-br ${statGradients[0]} text-white`}>
          <div className="stat-icon bg-white/20">
            <BookOpen size={24} />
          </div>
          <div className="stat-value">{courses.length}</div>
          <div className="stat-label text-white/80">Enrolled Courses</div>
        </div>

        <div className={`stat-card bg-gradient-to-br ${statGradients[1]} text-white`}>
          <div className="stat-icon bg-white/20">
            <Award size={24} />
          </div>
          <div className="stat-value">{gpa?.toFixed(2) || '0.00'}</div>
          <div className="stat-label text-white/80">Current GPA</div>
        </div>

        <div className={`stat-card bg-gradient-to-br ${statGradients[2]} text-white`}>
          <div className="stat-icon bg-white/20">
            <GraduationCap size={24} />
          </div>
          <div className="stat-value">{totalCredits}</div>
          <div className="stat-label text-white/80">Credits Earned</div>
        </div>

        <div className={`stat-card bg-gradient-to-br ${statGradients[3]} text-white`}>
          <div className="stat-icon bg-white/20">
            <Users size={24} />
          </div>
          <div className="stat-value">{attendance}%</div>
          <div className="stat-label text-white/80">Attendance</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Courses */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-normal text-gray-800">My Courses</h2>
              <span className="text-sm text-gray-500">{courses.length} total</span>
            </div>

            <div className="space-y-3">
              {courses.length > 0 ? (
                courses.slice(0, 5).map((course, index) => (
                  <div key={course.courseId} className="course-item">
                    <div className={`course-icon bg-gradient-to-br from-primary to-primary-light`}>
                      {course.courseId.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="course-name">{course.name}</h3>
                      <p className="course-details">
                        {course.courseId} • {course.credits} Credits
                      </p>
                    </div>
                    <div className={`course-grade ${getGradeColor(course.grade)}`}>
                      {course.grade || '—'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">No courses enrolled yet</p>
                </div>
              )}

              {courses.length > 5 && (
                <button className="btn btn-secondary w-full mt-2">
                  View All Courses
                  <ChevronRight size={16} className="ml-1" />
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Academic Progress */}
          <Card>
            <h2 className="text-lg font-normal text-gray-800 mb-4">Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Degree Completion</span>
                  <span className="font-normal text-primary">
                    {Math.round((totalCredits/120)*100)}%
                  </span>
                </div>
                <ProgressBar value={(totalCredits/120)*100} />
                <p className="text-xs text-gray-500 mt-1">{totalCredits}/120 credits</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">GPA Progress</span>
                  <span className="font-normal text-primary">
                    {Math.round((gpa/4)*100)}%
                  </span>
                </div>
                <ProgressBar value={(gpa/4)*100} />
                <p className="text-xs text-gray-500 mt-1">{gpa?.toFixed(2)} / 4.0</p>
              </div>
            </div>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <h2 className="text-lg font-normal text-gray-800 mb-4">Upcoming</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-xs text-primary">MAR</span>
                  <span className="text-sm font-medium text-primary">15</span>
                </div>
                <div>
                  <p className="text-sm font-normal text-gray-800">Midterm Exams Begin</p>
                  <p className="text-xs text-gray-500">All courses</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex flex-col items-center justify-center">
                  <span className="text-xs text-orange-600">MAR</span>
                  <span className="text-sm font-medium text-orange-600">27</span>
                </div>
                <div>
                  <p className="text-sm font-normal text-gray-800">Armed Forces Day</p>
                  <p className="text-xs text-gray-500">University closed</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Announcement */}
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} />
              <span className="text-sm font-normal">Announcement</span>
            </div>
            <p className="text-sm text-white/90">Midterm schedule released. Check your courses.</p>
            <p className="text-xs text-white/70 mt-2">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};
