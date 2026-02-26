import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
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
  Sparkles,
  Star,
  Heart,
  Zap,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, attendance, studentName, studentId, major, loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#667eea] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  let greeting = "Good morning";
  let GreetingIcon = Coffee;
  if (hour >= 12 && hour < 17) { greeting = "Good afternoon"; GreetingIcon = Sun; }
  if (hour >= 17) { greeting = "Good evening"; GreetingIcon = Moon; }

  const displayName = studentName || user?.displayName || "Student";
  const firstName = displayName.split(' ')[0];

  // Gradient colors for stat cards
  const statGradients = [
    'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500',
    'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
    'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
    'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500',
  ];

  // Course icon gradients
  const courseGradients = [
    'course-icon-1', 'course-icon-2', 'course-icon-3', 
    'course-icon-4', 'course-icon-5', 'course-icon-6'
  ];

  // Get grade color
  const getGradeColor = (grade: string) => {
    if (!grade) return 'bg-gray-100 text-gray-600';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-8">
      {/* Header with Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-xl">
            <GreetingIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              {greeting}, {firstName}!
              <Sparkles className="text-yellow-500" size={24} />
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-lg">
            ID: {studentId || 'AUY-2025-001'}
          </span>
          <span className="px-4 py-2 bg-white shadow-md rounded-full text-sm font-medium text-gray-700">
            {major || 'ISP Program'}
          </span>
        </div>
      </div>

      {/* Stats Cards - Colorful Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${statGradients[0]} stat-card`}>
          <div className="stat-icon">
            <BookOpen size={28} />
          </div>
          <div>
            <div className="stat-value">{courses.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Star size={16} className="text-yellow-300" />
            <span className="text-sm opacity-90">Active semester</span>
          </div>
        </div>

        <div className={`${statGradients[1]} stat-card`}>
          <div className="stat-icon">
            <Award size={28} />
          </div>
          <div>
            <div className="stat-value">{gpa?.toFixed(2) || '0.00'}</div>
            <div className="stat-label">Current GPA</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="progress-bar flex-1">
              <div className="progress-fill" style={{ width: `${(gpa / 4) * 100}%` }} />
            </div>
            <span className="text-sm opacity-90">/4.0</span>
          </div>
        </div>

        <div className={`${statGradients[2]} stat-card`}>
          <div className="stat-icon">
            <GraduationCap size={28} />
          </div>
          <div>
            <div className="stat-value">{totalCredits}</div>
            <div className="stat-label">Credits Earned</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Zap size={16} className="text-yellow-300" />
            <span className="text-sm opacity-90">{Math.round((totalCredits/120)*100)}% complete</span>
          </div>
        </div>

        <div className={`${statGradients[3]} stat-card`}>
          <div className="stat-icon">
            <Users size={28} />
          </div>
          <div>
            <div className="stat-value">{attendance}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Heart size={16} className="text-pink-300" />
            <span className="text-sm opacity-90">Great job!</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
              <span className="ml-auto text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {courses.length} total
              </span>
            </div>

            <div className="space-y-3">
              {courses.length > 0 ? (
                courses.slice(0, 5).map((course, index) => (
                  <div key={course.courseId} className="course-card">
                    <div className="flex items-center gap-4">
                      <div className={`course-icon ${courseGradients[index % courseGradients.length]}`}>
                        {course.courseId.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{course.name}</h3>
                        <p className="text-sm text-gray-500">
                          {course.courseId} • {course.credits} Credits • {course.teacher}
                        </p>
                      </div>
                      <div className={`grade-badge ${getGradeColor(course.grade)}`}>
                        {course.grade || '—'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">No courses enrolled yet</p>
                </div>
              )}

              {courses.length > 5 && (
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  View All Courses
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white">
                <Calendar size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-xs text-purple-500">MAR</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Midterm Exams Begin</h4>
                    <p className="text-xs text-gray-500">All courses • 8:00 AM</p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                  Academic
                </span>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">27</div>
                    <div className="text-xs text-orange-500">MAR</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Armed Forces Day</h4>
                    <p className="text-xs text-gray-500">University closed</p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                  Holiday
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Progress & Announcements */}
        <div className="space-y-6">
          {/* Academic Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg text-white">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Progress</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Degree Completion</span>
                  <span className="font-semibold text-purple-600">{Math.round((totalCredits/120)*100)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalCredits/120)*100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{totalCredits} of 120 credits completed</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">GPA Progress</span>
                  <span className="font-semibold text-blue-600">{Math.round((gpa/4)*100)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (gpa/4)*100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Current GPA: {gpa?.toFixed(2)} / 4.0</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg text-white">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Academic Standing</p>
                    <p className="text-xs text-gray-500">
                      {gpa >= 3.5 ? 'Dean\'s List' : gpa >= 2.0 ? 'Good Standing' : 'Academic Probation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={20} className="text-white" />
              <h2 className="text-xl font-bold text-white">Announcements</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={12} className="text-white/70" />
                  <span className="text-xs text-white/70">2 hours ago</span>
                </div>
                <p className="text-sm font-medium text-white">Midterm Schedule Released</p>
                <p className="text-xs text-white/70 mt-1">Check your course pages for details.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={12} className="text-white/70" />
                  <span className="text-xs text-white/70">Yesterday</span>
                </div>
                <p className="text-sm font-medium text-white">Holiday Notice</p>
                <p className="text-xs text-white/70 mt-1">University closed on March 27.</p>
              </div>
            </div>

            <button className="w-full mt-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all">
              View All Announcements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
