import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/Common';
import { User, Award, GraduationCap, Calendar } from 'lucide-react';

const importantDates = [
  { month: 'January', days: '1-4', name: 'New Year' },
  { month: 'February', days: '12-17', name: 'Union Day' },
  { month: 'March', days: '2,27-28', name: 'Armed Forces Day' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, attendance, studentName, studentId, major, loading } = useData();

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-normal text-gray-900 mb-8">
          Welcome, {studentName || user?.displayName || 'Student'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <User className="text-green-600 mb-2" size={32} />
            <p className="text-xl font-normal text-gray-900">{courses?.length || 0}</p>
            <p className="text-gray-600">Courses</p>
          </GlassCard>
          
          <GlassCard className="p-6">
            <Award className="text-green-600 mb-2" size={32} />
            <p className="text-xl font-normal text-gray-900">{gpa?.toFixed(2) || '0.00'}</p>
            <p className="text-gray-600">GPA</p>
          </GlassCard>
          
          <GlassCard className="p-6">
            <GraduationCap className="text-green-600 mb-2" size={32} />
            <p className="text-xl font-normal text-gray-900">{totalCredits || 0}</p>
            <p className="text-gray-600">Credits</p>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-green-600" size={20} />
            <h2 className="text-xl font-normal text-gray-900">Myanmar Holidays 2026</h2>
          </div>
          {importantDates.map((d, i) => (
            <div key={i} className="mb-2 pb-2 border-b border-gray-200">
              <p className="font-normal text-gray-900">{d.month}</p>
              <p className="text-green-600 text-sm">Days: {d.days}</p>
              <p className="text-gray-600 text-xs">{d.name}</p>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
};







