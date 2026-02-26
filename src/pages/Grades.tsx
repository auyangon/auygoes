import React from 'react';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/Common';
import { Award } from 'lucide-react';

export const Grades: React.FC = () => {
  const { courses, gpa, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pastel-blue border-t-pastel-purple rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-3xl font-medium text-gray-800 mb-2">My Grades</h2>
        <p className="text-gray-600">Current GPA: {gpa?.toFixed(2) || '0.00'}</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <GlassCard key={course.courseId} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-600">{course.courseId}</p>
              </div>
              <div className="text-xl font-medium text-pastel-blue">
                {course.grade || '-'}
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard className="p-8 text-center">
            <Award className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-600">No grades available yet.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
