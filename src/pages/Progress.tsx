import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, ProgressBar } from '../components/Common';
import { TrendingUp, Award, BookOpen, Target, Calendar } from 'lucide-react';

export const Progress: React.FC = () => {
  const { attendance, totalCredits, gpa, courses, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#667eea] border-t-transparent"></div>
      </div>
    );
  }

  const requiredCredits = 120;
  const progressPercentage = (totalCredits / requiredCredits) * 100;
  const gpaPercentage = (gpa / 4) * 100;

  // Calculate semester progress (mock - you can replace with actual data)
  const semesterProgress = 65; // Example: 65% through semester

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Academic Progress</h1>
        <p className="text-gray-500 text-sm mt-1">Track your journey to graduation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award size={24} />
            </div>
            <div>
              <p className="text-purple-100 text-sm">Current GPA</p>
              <p className="text-3xl font-bold">{gpa?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Credits Earned</p>
              <p className="text-3xl font-bold">{totalCredits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target size={24} />
            </div>
            <div>
              <p className="text-green-100 text-sm">Attendance</p>
              <p className="text-3xl font-bold">{attendance}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-orange-100 text-sm">Courses</p>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Degree Progress */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Degree Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Credits Completed</span>
                <span className="font-semibold text-purple-600">{totalCredits}/{requiredCredits}</span>
              </div>
              <ProgressBar value={progressPercentage} />
              <p className="text-xs text-gray-500 mt-2">{progressPercentage.toFixed(1)}% toward graduation</p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">GPA Progress</span>
                <span className="font-semibold text-blue-600">{gpa?.toFixed(2)}/4.0</span>
              </div>
              <ProgressBar value={gpaPercentage} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Semester Progress</span>
                <span className="font-semibold text-green-600">{semesterProgress}%</span>
              </div>
              <ProgressBar value={semesterProgress} />
            </div>
          </div>
        </Card>

        {/* Course Progress */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Progress</h2>
          <div className="space-y-4">
            {courses.slice(0, 5).map((course) => (
              <div key={course.courseId} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{course.name}</span>
                  {course.grade && (
                    <span className={`text-sm font-semibold ${
                      course.grade.startsWith('A') ? 'text-green-600' :
                      course.grade.startsWith('B') ? 'text-blue-600' :
                      course.grade.startsWith('C') ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>{course.grade}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen size={12} />
                  <span>{course.credits} Credits</span>
                  {course.attendancePercentage && (
                    <>
                      <span>•</span>
                      <TrendingUp size={12} />
                      <span>{course.attendancePercentage}% Attendance</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Achievement Card */}
      <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-4">
          <Award size={48} className="text-white/50" />
          <div>
            <h3 className="text-xl font-bold mb-1">Keep up the great work!</h3>
            <p className="text-indigo-100 text-sm">
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
