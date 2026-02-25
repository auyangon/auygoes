import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle } from '../components/Common';
import { Award } from 'lucide-react';

export const Grades: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa } = useData();

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">My Grades</h2>
        <p className="text-white/60">Current GPA: {gpa.toFixed(2)}</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <GlassCard key={course.courseId} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{course.name}</h3>
              <p className="text-sm text-white/60">{course.courseId}</p>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {course.grade || '-'}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
