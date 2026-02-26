import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, Badge } from '../components/Common';
import { Award, TrendingUp } from 'lucide-react';

export const Grades: React.FC = () => {
  const { courses, gpa, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#667eea] border-t-transparent"></div>
      </div>
    );
  }

  // Calculate grade distribution
  const gradeCount = courses.reduce((acc, course) => {
    if (course.grade) {
      const letter = course.grade.charAt(0);
      acc[letter] = (acc[letter] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const getGradeColor = (grade: string) => {
    if (!grade) return 'bg-gray-100 text-gray-600';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-700';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Grades</h1>
          <p className="text-gray-500 text-sm mt-1">Academic performance overview</p>
        </div>
        <Badge variant="primary">GPA: {gpa?.toFixed(2) || '0.00'}</Badge>
      </div>

      {/* GPA Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm mb-1">Current GPA</p>
            <p className="text-5xl font-bold mb-2">{gpa?.toFixed(2) || '0.00'}</p>
            <p className="text-purple-100 text-sm">out of 4.0</p>
          </div>
          <div className="text-right">
            <TrendingUp size={48} className="text-white/50" />
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${(gpa / 4) * 100}%` }}
          />
        </div>
      </Card>

      {/* Grade Distribution */}
      {Object.keys(gradeCount).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(gradeCount).map(([letter, count]) => (
              <div key={letter} className="flex-1 text-center p-3 bg-gray-50 rounded-lg">
                <span className={`text-lg font-bold ${
                  letter === 'A' ? 'text-green-600' :
                  letter === 'B' ? 'text-blue-600' :
                  letter === 'C' ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>{letter}</span>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-xs text-gray-500">courses</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Course Grades */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Course Grades</h2>
      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <Card key={course.courseId} className="p-4 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.courseId}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getGradeColor(course.grade)}`}>
                {course.grade || '-'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
