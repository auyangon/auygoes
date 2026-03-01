// src/pages/CourseAttendance.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge, ProgressBar } from '../components/Common';
import { BookOpen, Calendar, ChevronLeft } from 'lucide-react';

export const CourseAttendance: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useData();
  const navigate = useNavigate();

  const course = courses.find(c => c.courseId === courseId);

  if (!course) {
    return (
      <MainLayout>
        <Card className="p-12 text-center">
          <p className="text-[#2a2a2a]">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 px-4 py-2 bg-[#0B4F3A] text-white rounded-lg"
          >
            Back to Courses
          </button>
        </Card>
      </MainLayout>
    );
  }

  // Mock attendance data - replace with real data from Firebase
  const attendanceRecords = [
    { date: '2026-03-01', status: 'present' },
    { date: '2026-03-03', status: 'present' },
    { date: '2026-03-05', status: 'late' },
    { date: '2026-03-08', status: 'present' },
    { date: '2026-03-10', status: 'absent' },
  ];

  return (
    <MainLayout>
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-1 text-sm text-[#1a1a1a] hover:text-[#0B4F3A] mb-4"
      >
        <ChevronLeft size={16} />
        Back to Courses
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{course.name}</h1>
        <p className="text-[#2a2a2a]">{course.courseId} • {course.teacher}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-[#2a2a2a] mb-1">Credits</div>
          <div className="text-2xl font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{course.credits}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-[#2a2a2a] mb-1">Grade</div>
          <div className="text-2xl font-semibold text-[#0B4F3A]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{course.grade || '-'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-[#2a2a2a] mb-1">Attendance</div>
          <div className="text-2xl font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{course.attendancePercentage}%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-[#2a2a2a] mb-1">Total Classes</div>
          <div className="text-2xl font-semibold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{attendanceRecords.length}</div>
        </Card>
      </div>

      <SectionTitle icon={<Calendar size={20} className="text-[#0B4F3A]" />}>
        Attendance History
      </SectionTitle>

      <Card className="p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-[#1a1a1a]">Date</th>
              <th className="text-left p-4 text-sm font-medium text-[#1a1a1a]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {attendanceRecords.map((record, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-4 text-sm">{record.date}</td>
                <td className="p-4">
                  <Badge variant={
                    record.status === 'present' ? 'success' :
                    record.status === 'late' ? 'warning' : 'danger'
                  }>
                    {record.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </MainLayout>
  );
};

