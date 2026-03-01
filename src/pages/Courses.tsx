import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { BookOpen, GraduationCap } from 'lucide-react';

export const Courses: React.FC = () => {
  const { courses, loading } = useData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <SectionTitle icon={<BookOpen size={20} className="text-[#2E8B57]" />}>
        My Courses
      </SectionTitle>

      {courses.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600">No courses found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="p-5 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/course/${course.courseId}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{course.name}</h3>
                <Badge variant="primary" className="bg-[#2E8B57] text-white">
                  {course.courseId}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">{course.teacher}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>Credits: {course.credits}</span>
                <span>Grade: {course.grade || '—'}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Attendance</span>
                  <span className="text-xs font-medium text-[#2E8B57]">{course.attendancePercentage}%</span>
                </div>
                <ProgressBar value={course.attendancePercentage || 0} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
};
