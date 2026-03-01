// src/pages/Profile.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge, Button } from '../components/Common';
import { User, Mail, BookOpen, Award, Calendar } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { studentName, studentEmail, major, courses, gpa, totalCredits, attendance } = useData();

  return (
    <MainLayout>
      <SectionTitle icon={<User size={20} className="text-[#0B4F3A]" />}>
        My Profile
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#0B4F3A] rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{studentName || 'Student'}</h2>
            <p className="text-sm text-gray-500">{studentEmail}</p>
            <Badge variant="primary" className="mt-2">{major || 'ISP'}</Badge>
          </div>
        </Card>

        <Card className="p-6 col-span-2">
          <h3 className="font-medium text-gray-800 mb-4">Academic Summary</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <Award className="mx-auto text-[#0B4F3A] mb-2" size={24} />
              <div className="text-xl font-semibold">{gpa.toFixed(2)}</div>
              <div className="text-xs text-gray-500">GPA</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <BookOpen className="mx-auto text-[#0B4F3A] mb-2" size={24} />
              <div className="text-xl font-semibold">{totalCredits}</div>
              <div className="text-xs text-gray-500">Credits</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <Calendar className="mx-auto text-[#0B4F3A] mb-2" size={24} />
              <div className="text-xl font-semibold">{courses.length}</div>
              <div className="text-xs text-gray-500">Courses</div>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Attendance Rate</span>
              <span className="font-semibold text-[#0B4F3A]">{attendance}%</span>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
