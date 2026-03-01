// src/pages/AUYExams.tsx
import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle } from '../components/Common';
import { GraduationCap } from 'lucide-react';

export const AUYExams: React.FC = () => {
  return (
    <MainLayout>
      <SectionTitle icon={<GraduationCap size={20} className="text-[#0B4F3A]" />}>
        Exam Portal
      </SectionTitle>

      <Card className="p-12 text-center">
        <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500">Exam schedules will appear here</p>
        <p className="text-sm text-gray-400 mt-2">Check back later for updates</p>
      </Card>
    </MainLayout>
  );
};
