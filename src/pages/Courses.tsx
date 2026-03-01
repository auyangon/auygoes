// src/pages/Courses.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { BookOpen } from 'lucide-react';

export const Courses: React.FC = () => {
  const { courses } = useData();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
        My Courses
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/course/${course.courseId}`)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800">{course.name}</h3>
              <Badge variant="primary">{course.courseId}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{course.teacher}</p>
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-gray-500">Credits: {course.credits}</span>
              <span className="font-medium text-[#0B4F3A]">Grade: {course.grade || '-'}</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Attendance</span>
                <span className="text-xs font-medium text-[#0B4F3A]">{course.attendancePercentage}%</span>
              </div>
              <ProgressBar value={course.attendancePercentage || 0} />
            </div>
          </Card>
        ))}
        {courses.length === 0 && (
          <Card className="p-12 text-center col-span-2">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No courses found</p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
