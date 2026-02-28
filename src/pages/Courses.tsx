import React from 'react';
import { useData } from '../contexts/DataContext';
import { BookOpen } from 'lucide-react';

export const Courses: React.FC = () => {
  const { courses, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0B4F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium text-gray-800">My Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B4F3A] bg-opacity-10 flex items-center justify-center">
                <BookOpen className="text-[#0B4F3A]" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500">{course.courseId}</p>
                <p className="text-xs text-gray-400 mt-1">{course.teacher} • {course.credits} credits</p>
              </div>
              {course.grade && (
                <div className="text-lg font-medium text-[#0B4F3A]">{course.grade}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
