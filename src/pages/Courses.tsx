import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, Badge } from '../components/Common';
import { BookOpen, User, Clock, MapPin } from 'lucide-react';

export const Courses: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#667eea] border-t-transparent"></div>
      </div>
    );
  }

  // Course icon gradients
  const courseGradients = [
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-500 to-purple-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-500 text-sm mt-1">View all your enrolled courses</p>
        </div>
        <Badge variant="primary">{courses.length} Courses</Badge>
      </div>

      {error ? (
        <Card className="p-8 text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-500 text-sm mt-2">Please check your connection</p>
        </Card>
      ) : courses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Found</h3>
          <p className="text-gray-500">You are not enrolled in any courses yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={course.courseId} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl ${courseGradients[index % courseGradients.length]} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {course.courseId.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{course.courseId}</p>
                  
                  <div className="space-y-1">
                    {course.teacher && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User size={12} />
                        <span>{course.teacher}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <BookOpen size={12} />
                      <span>{course.credits} Credits</span>
                    </div>
                    
                    {course.schedule && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{course.schedule}</span>
                      </div>
                    )}
                    
                    {course.room && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{course.room}</span>
                      </div>
                    )}
                  </div>
                  
                  {course.grade && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Grade: </span>
                      <span className={`text-sm font-semibold ${
                        course.grade.startsWith('A') ? 'text-green-600' :
                        course.grade.startsWith('B') ? 'text-blue-600' :
                        course.grade.startsWith('C') ? 'text-yellow-600' :
                        'text-orange-600'
                      }`}>{course.grade}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
