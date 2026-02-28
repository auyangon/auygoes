import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, SectionTitle } from '../components/Common';
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">My Courses</h1>
        <p className="text-gray-500">Spring 2026 semester</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, idx) => (
          <Card key={idx} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#0B4F3A] bg-opacity-10 flex items-center justify-center">
                <BookOpen className="text-[#0B4F3A]" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{course.courseId}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs bg-[#e0f2fe] text-[#0B4F3A] px-2 py-1 rounded-full">
                    {course.credits} credits
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{course.teacher}</span>
                </div>
              </div>
              {course.grade && (
                <div className="text-xl font-bold text-[#0B4F3A] bg-[#e0f2fe] px-3 py-1 rounded-lg">
                  {course.grade}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No courses found for Spring 2026</p>
        </Card>
      )}
    </div>
  );
};
