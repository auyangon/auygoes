// src/pages/Grades.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge } from '../components/Common';
import { Award } from 'lucide-react';

export const Grades: React.FC = () => {
  const { courses, gpa } = useData();

  return (
    <MainLayout>
      <SectionTitle icon={<Award size={20} className="text-[#0B4F3A]" />}>
        My Grades
      </SectionTitle>

      <Card className="p-6 mb-6 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white/80 text-sm">Current GPA</p>
            <p className="text-4xl font-bold">{gpa.toFixed(2)}</p>
          </div>
          <Award size={48} className="text-white/50" />
        </div>
      </Card>

      <div className="space-y-3">
        {courses.map(course => (
          <Card key={course.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{course.name}</h3>
              <p className="text-sm text-[#2a2a2a]">{course.courseId}</p>
            </div>
            <Badge variant="primary" className="text-base px-3 py-1">
              {course.grade || '-'}
            </Badge>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

