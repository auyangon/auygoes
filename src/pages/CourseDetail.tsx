import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Card, SectionTitle, Badge } from '../components/Common';
import { Calendar, CheckCircle, XCircle, Clock, User, BookOpen } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, attendanceRecords } = useData();
  
  const course = courses.find(c => c.courseId === courseId);
  const courseAttendance = attendanceRecords.filter(a => a.courseId === courseId);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present': return <CheckCircle className="text-green-500" size={16} />;
      case 'late': return <Clock className="text-yellow-500" size={16} />;
      case 'absent': return <XCircle className="text-red-500" size={16} />;
      default: return null;
    }
  };

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#2a2a2a]">Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>{course.name}</h1>
        <p className="text-[#2a2a2a]">{course.courseId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
            Course Information
          </SectionTitle>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <User size={16} className="text-[#0B4F3A]" />
              <span className="text-[#1a1a1a]">Teacher: {course.teacher}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <BookOpen size={16} className="text-[#0B4F3A]" />
              <span className="text-[#1a1a1a]">Credits: {course.credits}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <CheckCircle size={16} className="text-[#0B4F3A]" />
              <span className="text-[#1a1a1a]">Grade: {course.grade || 'Not graded'}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle icon={<Calendar size={20} className="text-[#0B4F3A]" />}>
            Attendance Summary
          </SectionTitle>
          
          <div className="mt-4 text-center">
            <div className="text-4xl font-bold text-[#0B4F3A]">{course.attendancePercentage}%</div>
            <p className="text-sm text-[#2a2a2a] mt-1">Overall Attendance</p>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]">Present:</span>
              <span className="font-medium text-green-600">
                {courseAttendance.filter(a => a.status === 'present').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]">Late:</span>
              <span className="font-medium text-yellow-600">
                {courseAttendance.filter(a => a.status === 'late').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#1a1a1a]">Absent:</span>
              <span className="font-medium text-red-600">
                {courseAttendance.filter(a => a.status === 'absent').length}
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-[#1a1a1a]">Total Classes:</span>
              <span className="font-medium">{courseAttendance.length}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle icon={<Calendar size={20} className="text-[#0B4F3A]" />}>
          Attendance History
        </SectionTitle>

        {courseAttendance.length === 0 ? (
          <p className="text-[#2a2a2a] text-center py-8">No attendance records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-sm font-medium text-[#1a1a1a]">Date</th>
                  <th className="p-3 text-left text-sm font-medium text-[#1a1a1a]">Status</th>
                  <th className="p-3 text-left text-sm font-medium text-[#1a1a1a]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {courseAttendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-sm">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className="text-sm capitalize">{record.status}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-[#2a2a2a]">{record.notes || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

