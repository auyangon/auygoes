import React from 'react';
import { Calendar } from 'lucide-react';

export const Exams: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Exam Schedule</h1>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-[#2a2a2a]">No exams scheduled at this time.</p>
        <p className="text-sm text-[#2a2a2a] mt-2">Check back later for updates.</p>
      </div>
    </div>
  );
};

