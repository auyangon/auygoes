// src/pages/Materials.tsx
import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle } from '../components/Common';
import { FileText } from 'lucide-react';

export const Materials: React.FC = () => {
  return (
    <MainLayout>
      <SectionTitle icon={<FileText size={20} className="text-[#0B4F3A]" />}>
        Course Materials
      </SectionTitle>

      <Card className="p-12 text-center">
        <FileText className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500">Materials will appear here</p>
      </Card>
    </MainLayout>
  );
};
