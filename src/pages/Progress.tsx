// src/pages/Progress.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, ProgressBar } from '../components/Common';
import { TrendingUp } from 'lucide-react';

export const Progress: React.FC = () => {
  const { gpa, totalCredits, attendance, courses } = useData();
  const requiredCredits = 120;
  const degreeProgress = (totalCredits / requiredCredits) * 100;

  return (
    <MainLayout>
      <SectionTitle icon={<TrendingUp size={20} className="text-[#0B4F3A]" />}>
        Academic Progress
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-gray-500 mb-1">GPA</div>
          <div className="text-2xl font-semibold">{gpa.toFixed(2)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500 mb-1">Credits</div>
          <div className="text-2xl font-semibold">{totalCredits}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500 mb-1">Attendance</div>
          <div className="text-2xl font-semibold">{attendance}%</div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-medium mb-2">Degree Progress</h3>
        <div className="flex justify-between text-sm mb-1">
          <span>{totalCredits} / {requiredCredits} credits</span>
          <span>{degreeProgress.toFixed(1)}%</span>
        </div>
        <ProgressBar value={degreeProgress} />
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Course Progress</h3>
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{course.name}</span>
                <span>{course.attendancePercentage}%</span>
              </div>
              <ProgressBar value={course.attendancePercentage || 0} />
            </div>
          ))}
        </div>
      </Card>
    </MainLayout>
  );
};
