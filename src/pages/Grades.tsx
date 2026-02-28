import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, Badge, SectionTitle } from '../components/Common';
import { Award, TrendingUp, BookOpen } from 'lucide-react';

export const Grades: React.FC = () => {
  const { courses, gpa, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0B4F3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">My Grades</h1>
        <p className="text-gray-500">Academic performance overview</p>
      </div>

      {/* GPA Card */}
      <Card className="p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Current GPA</p>
            <p className="text-5xl font-bold mb-2">{gpa?.toFixed(2) || '0.00'}</p>
            <p className="text-white/60 text-sm">out of 4.0</p>
          </div>
          <div className="text-right">
            <TrendingUp size={48} className="text-white/30" />
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
          <SectionTitle icon={<Award size={20} className="text-[#0B4F3A]" />}>
            Grade Distribution
          </SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Object.entries(gradeCount).map(([letter, count]) => (
              <div key={letter} className="text-center p-4 bg-[#e0f2fe] rounded-lg">
                <span className={`text-2xl font-bold ${
                  letter === 'A' ? 'text-green-600' :
                  letter === 'B' ? 'text-blue-600' :
                  letter === 'C' ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>{letter}</span>
                <p className="text-xl font-bold text-gray-800 mt-1">{count}</p>
                <p className="text-xs text-gray-500">courses</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Course Grades */}
      <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
        Course Grades
      </SectionTitle>
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
