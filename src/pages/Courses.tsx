import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, ProgressBar } from '../components/Common';
import { 
  BookOpen, 
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  GraduationCap,
  Calendar,
  TrendingUp
} from 'lucide-react';

export const Courses: React.FC = () => {
  const { courses, attendanceRecords, loading } = useData();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const getCourseAttendance = (courseId: string) => {
    return attendanceRecords.filter(r => r.courseId === courseId);
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    const courseAttendance = getCourseAttendance(course.courseId);
    const percentage = course.attendancePercentage || 0;
    return filter === 'in-progress' ? percentage < 100 : percentage === 100;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#0B4F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-800">My Courses</h1>
          <p className="text-sm text-gray-500 mt-1">
            {courses.length} courses • {attendanceRecords.length} attendance records
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              filter === 'all' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'
            }`}
          >
            All ({courses.length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              filter === 'in-progress' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              filter === 'completed' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">No courses found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((course) => {
            const courseAttendance = getCourseAttendance(course.courseId);
            const present = courseAttendance.filter(r => r.status === 'present').length;
            const late = courseAttendance.filter(r => r.status === 'late').length;
            const absent = courseAttendance.filter(r => r.status === 'absent').length;
            const total = courseAttendance.length;

            return (
              <Card 
                key={course.id} 
                className="p-5 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(`/course/${course.courseId}`)}
              >
                {/* Course Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-[#0B4F3A] bg-opacity-10 rounded-lg">
                      <BookOpen className="text-[#0B4F3A]" size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.courseId}</p>
                      <p className="text-xs text-gray-400 mt-1">{course.teacher}</p>
                    </div>
                  </div>
                  <Badge variant={
                    course.attendancePercentage && course.attendancePercentage >= 80 ? 'success' :
                    course.attendancePercentage && course.attendancePercentage >= 60 ? 'warning' : 'default'
                  }>
                    {course.attendancePercentage || 0}%
                  </Badge>
                </div>

                {/* Attendance Stats */}
                {total > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 text-xs mb-1">
                        <CheckCircle size={12} />
                        <span>Present</span>
                      </div>
                      <span className="text-lg font-medium text-green-700">{present}</span>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-600 text-xs mb-1">
                        <Clock size={12} />
                        <span>Late</span>
                      </div>
                      <span className="text-lg font-medium text-yellow-700">{late}</span>
                    </div>
                    <div className="bg-red-50 p-2 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1 text-red-600 text-xs mb-1">
                        <XCircle size={12} />
                        <span>Absent</span>
                      </div>
                      <span className="text-lg font-medium text-red-700">{absent}</span>
                    </div>
                  </div>
                )}

                {/* Grade and Credits */}
                <div className="flex justify-between items-center text-sm mb-3">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">Grade: <span className="font-medium text-gray-700">{course.grade || '-'}</span></span>
                    <span className="text-gray-500">Credits: <span className="font-medium text-gray-700">{course.credits}</span></span>
                  </div>
                  {course.grade && (
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {gradePoints[course.grade]?.toFixed(1) || '-'} GPA
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Attendance Progress</span>
                      <span className="font-medium text-gray-700">{present + late}/{total} classes</span>
                    </div>
                    <ProgressBar value={course.attendancePercentage || 0} className="h-1.5" />
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>{total} classes recorded</span>
                  </div>
                  <span className="text-xs text-[#0B4F3A] group-hover:underline flex items-center gap-1">
                    View Details
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
