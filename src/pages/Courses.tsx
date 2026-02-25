import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/Common';
import { BookOpen, User, Clock, MapPin } from 'lucide-react';

export const Courses: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading, error } = useData();

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

      {error ? (
        <GlassCard className="p-8 text-center border-red-500/20">
          <p className="text-red-400 font-medium">{error}</p>
          <p className="text-white/40 text-xs mt-2">Please check your connection</p>
        </GlassCard>
      ) : courses.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <BookOpen className="text-emerald-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl text-white mb-2">No Courses Found</h3>
          <p className="text-white/40">You are not enrolled in any courses yet.</p>
        </GlassCard>
      ) : (
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
                    <div className="flex items-center gap-1 mt-2 text-white/40">
                      <User size={12} />
                      <p className="text-xs">{course.teacherName}</p>
                    </div>
                  )}
                  
                  {course.schedule && (
                    <div className="flex items-center gap-1 mt-1 text-white/40">
                      <Clock size={12} />
                      <p className="text-xs">{course.schedule}</p>
                    </div>
                  )}
                  
                  {course.room && (
                    <div className="flex items-center gap-1 mt-1 text-white/40">
                      <MapPin size={12} />
                      <p className="text-xs">{course.room}</p>
                    </div>
                  )}
                  
                  {course.grade && (
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <span className="text-xs text-white/40">Grade: </span>
                      <span className="text-emerald-400 font-bold">{course.grade}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};