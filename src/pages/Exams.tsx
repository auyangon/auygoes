import React from 'react';
import { Calendar } from 'lucide-react';

export const Exams: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium text-gray-800">Exam Schedule</h1>
      
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
        <p className="text-gray-500">No exams scheduled at this time.</p>
        <p className="text-sm text-gray-400 mt-2">Check back later for updates.</p>
      </div>
    </div>
  );
};
