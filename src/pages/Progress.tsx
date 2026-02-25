import React from 'react';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/Common';
import { TrendingUp } from 'lucide-react';

export const Progress: React.FC = () => {
  const { attendance, totalCredits, gpa } = useData();

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">Academic Progress</h2>
        <p className="text-white/60">Track your journey</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <TrendingUp className="text-emerald-400 mb-4" size={32} />
          <h3 className="text-2xl font-bold text-white">{attendance}%</h3>
          <p className="text-white/60">Attendance</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-2xl font-bold text-white">{totalCredits}</h3>
          <p className="text-white/60">Total Credits</p>
        </GlassCard>
      </div>
    </div>
  );
};
