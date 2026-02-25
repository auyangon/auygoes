import React from 'react';
import { GlassCard } from '../components/Common';

export const Exams: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-medium text-gray-700">My Exams</h1>
      <GlassCard>
        <p className="text-gray-600">Exam timetable will appear here.</p>
      </GlassCard>
    </div>
  );
};
