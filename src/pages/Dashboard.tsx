import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, StatCard, SectionTitle, Badge, CourseItem, ProgressBar, Button } from '../components/Common';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Bell, 
  TrendingUp,
  Award,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, attendance, studentName, studentId, major, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B4F3A] border-t-transparent"></div>
      </div>
    );
  }

  const currentTime = new Date();
  const hour = currentTime.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";

  const displayName = studentName || user?.displayName || "Student";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {greeting}, {displayName.split(' ')[0]}!
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
        <div className="flex items-center gap-3">
          <Badge variant="primary">Student ID: {studentId || 'AUY-2025-001'}</Badge>
          <Badge>{major || 'ISP Program'}</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BookOpen size={24} />}
          value={courses.length}
          label="Enrolled Courses"
        />
        <StatCard 
          icon={<Award size={24} />}
          value={gpa?.toFixed(2) || '0.00'}
          label="Current GPA"
        />
        <StatCard 
          icon={<GraduationCap size={24} />}
          value={totalCredits}
          label="Credits Earned"
        />
        <StatCard 
          icon={<Users size={24} />}
          value={`${attendance}%`}
          label="Attendance Rate"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <SectionTitle icon={<BookOpen size={18} />}>
              Current Courses
            </SectionTitle>
            <div className="space-y-3 mt-4">
              {courses.slice(0, 5).map((course) => (
                <CourseItem
                  key={course.courseId}
                  name={course.name}
                  code={course.courseId}
                  credits={course.credits}
                  grade={course.grade}
                />
              ))}
              {courses.length > 5 && (
                <Button variant="secondary" className="w-full mt-2">
                  View All Courses
                  <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<Calendar size={18} />}>
              Upcoming Events
            </SectionTitle>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-lg text-[#0B4F3A]">15</div>
                  <div className="text-xs text-gray-500">MAR</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Midterm Exams Begin</h4>
                  <p className="text-xs text-gray-500">All courses • 8:00 AM</p>
                </div>
                <Badge>Academic</Badge>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-lg text-[#0B4F3A]">27</div>
                  <div className="text-xs text-gray-500">MAR</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Armed Forces Day</h4>
                  <p className="text-xs text-gray-500">University closed</p>
                </div>
                <Badge variant="warning">Holiday</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Academic Progress */}
        <div className="space-y-6">
          <Card>
            <SectionTitle icon={<TrendingUp size={18} />}>
              Academic Progress
            </SectionTitle>
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Degree Completion</span>
                  <span className="font-medium text-[#0B4F3A]">{Math.round((totalCredits/120)*100)}%</span>
                </div>
                <ProgressBar value={(totalCredits/120)*100} />
                <p className="text-xs text-gray-500 mt-2">{totalCredits} of 120 credits completed</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">GPA Target</span>
                  <span className="font-medium text-[#0B4F3A]">{Math.round((gpa/4)*100)}%</span>
                </div>
                <ProgressBar value={(gpa/4)*100} />
                <p className="text-xs text-gray-500 mt-2">Current GPA: {gpa?.toFixed(2)} / 4.0</p>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<Bell size={18} />}>
              Announcements
            </SectionTitle>
            <div className="space-y-3 mt-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Midterm Schedule Released</p>
                <p className="text-xs text-gray-500 mt-1">Check your course pages for details.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Holiday Notice</p>
                <p className="text-xs text-gray-500 mt-1">University closed on March 27.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
