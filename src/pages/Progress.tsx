import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, ProgressBar, SectionTitle } from '../components/Common';
import { TrendingUp, Award, BookOpen, Target, Calendar, CheckCircle } from 'lucide-react';

export const Progress: React.FC = () => {
  const { attendance, totalCredits, gpa, courses, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0B4F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const requiredCredits = 120;
  const progressPercentage = (totalCredits / requiredCredits) * 100;
  const gpaPercentage = (gpa / 4) * 100;
  const semesterProgress = 65;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">Academic Progress</h1>
        <p className="text-gray-500">Track your journey to graduation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Current GPA</p>
              <p className="text-3xl font-bold">{gpa?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Credits Earned</p>
              <p className="text-3xl font-bold">{totalCredits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Attendance</p>
              <p className="text-3xl font-bold">{attendance}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Courses</p>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle icon={<TrendingUp size={20} className="text-[#0B4F3A]" />}>
            Degree Progress
          </SectionTitle>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Credits Completed</span>
                <span className="font-semibold text-[#0B4F3A]">{totalCredits}/{requiredCredits}</span>
              </div>
              <ProgressBar value={progressPercentage} />
              <p className="text-xs text-gray-500 mt-2">{progressPercentage.toFixed(1)}% toward graduation</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">GPA Progress</span>
                <span className="font-semibold text-[#0B4F3A]">{gpa?.toFixed(2)}/4.0</span>
              </div>
              <ProgressBar value={gpaPercentage} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Semester Progress</span>
                <span className="font-semibold text-[#0B4F3A]">{semesterProgress}%</span>
              </div>
              <ProgressBar value={semesterProgress} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
            Course Progress
          </SectionTitle>
          <div className="space-y-4">
            {courses.slice(0, 5).map((course) => (
              <div key={course.courseId} className="p-3 bg-[#e0f2fe] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{course.name}</span>
                  {course.grade && (
                    <span className="text-sm font-semibold text-[#0B4F3A]">
                      {course.grade}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen size={12} />
                  <span>{course.credits} Credits</span>
                  {course.attendancePercentage && (
                    <>
                      <span>•</span>
                      <CheckCircle size={12} className="text-[#0B4F3A]" />
                      <span>{course.attendancePercentage}% Attendance</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white">
        <div className="flex items-center gap-4">
          <Award size={48} className="text-white/50" />
          <div>
            <h3 className="text-xl font-bold mb-1">Keep up the great work!</h3>
            <p className="text-white/80 text-sm">
              {gpa >= 3.5 ? "You're on track for Dean's List!" :
               gpa >= 3.0 ? "Good academic standing - keep it up!" :
               "Stay focused - you can improve your GPA!"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
