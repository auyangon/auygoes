import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard, SectionTitle } from '../components/Common';
import { BookOpen } from 'lucide-react';

export const Courses: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white mb-2">My Courses</h2>
        <p className="text-white/60">View all your enrolled courses</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <GlassCard key={course.courseId} className="p-6 hover:scale-[1.02] transition-transform">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <BookOpen className="text-emerald-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{course.name}</h3>
                <p className="text-sm text-white/60">{course.courseId}</p>
                <p className="text-sm text-emerald-400 mt-2">{course.credits} Credits</p>
                {course.teacherName && (
                  <p className="text-xs text-white/40 mt-1">Instructor: {course.teacherName}</p>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
