// src/pages/Calendar.tsx
import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle } from '../components/Common';
import { Calendar as CalendarIcon } from 'lucide-react';

export const Calendar: React.FC = () => {
  return (
    <MainLayout>
      <SectionTitle icon={<CalendarIcon size={20} className="text-[#0B4F3A]" />}>
        Academic Calendar
      </SectionTitle>

      <Card className="p-12 text-center">
        <CalendarIcon className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500">Calendar will appear here</p>
      </Card>
    </MainLayout>
  );
};
