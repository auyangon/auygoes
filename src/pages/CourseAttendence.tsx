// src/pages/CourseAttendance.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Card, Badge, ProgressBar } from '../components/Common';
import { 
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

export const CourseAttendance: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const course = courses.find(c => c.courseId === courseId);

  // Sample attendance records - replace with real data from your attendance sheet
  const attendanceRecords = [
    { date: '2026-03-01', status: 'present' },
    { date: '2026-03-03', status: 'present' },
    { date: '2026-03-05', status: 'late' },
    { date: '2026-03-08', status: 'present' },
    { date: '2026-03-10', status: 'absent' },
    { date: '2026-03-12', status: 'present' },
    { date: '2026-03-15', status: 'present' },
    { date: '2026-03-17', status: 'late' },
    { date: '2026-03-19', status: 'present' },
    { date: '2026-03-22', status: 'present' },
  ];

  // Calculate stats
  const totalClasses = attendanceRecords.length;
  const present = attendanceRecords.filter(r => r.status === 'present').length;
  const late = attendanceRecords.filter(r => r.status === 'late').length;
  const absent = attendanceRecords.filter(r => r.status === 'absent').length;
  const percentage = totalClasses ? Math.round(((present + late) / totalClasses) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present': return <CheckCircle className="text-green-500" size={16} />;
      case 'late': return <Clock className="text-yellow-500" size={16} />;
      case 'absent': return <XCircle className="text-red-500" size={16} />;
      default: return null;
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#2a2a2a]">Course not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/courses')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-medium text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{course.name}</h1>
          <p className="text-sm text-[#2a2a2a]">{course.courseId} â€¢ {course.teacher}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2a2a2a]">Total Classes</span>
            <Calendar size={16} className="text-[#2a2a2a]" />
          </div>
          <div className="text-2xl font-medium text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{totalClasses}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2a2a2a]">Present</span>
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-medium text-green-600" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{present}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2a2a2a]">Late</span>
            <Clock size={16} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-medium text-yellow-600" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{late}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2a2a2a]">Absent</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-medium text-red-600" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{absent}</div>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-[#0a0a0a]">Attendance Overview</h3>
          <Badge variant={percentage >= 75 ? 'success' : 'warning'}>
            {percentage}% Overall
          </Badge>
        </div>
        <ProgressBar value={percentage} className="h-2" />
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-[#2a2a2a]">Required: 75%</span>
          <span className={percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
            {percentage >= 75 ? 'âœ… Meeting requirement' : 'âš ï¸ Below requirement'}
          </span>
        </div>
      </Card>

      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[#0a0a0a]">Attendance History</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
            {monthNames[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-[#1a1a1a]">Date</th>
              <th className="text-left p-4 text-sm font-medium text-[#1a1a1a]">Day</th>
              <th className="text-left p-4 text-sm font-medium text-[#1a1a1a]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {attendanceRecords
              .filter(record => {
                const date = new Date(record.date);
                return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
              })
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record, idx) => {
                const date = new Date(record.date);
                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-4 text-sm">
                      {date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="p-4 text-sm text-[#1a1a1a]">
                      {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="text-sm capitalize">{record.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {attendanceRecords.filter(record => {
          const date = new Date(record.date);
          return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        }).length === 0 && (
          <div className="p-8 text-center text-[#2a2a2a]">
            No attendance records for this month
          </div>
        )}
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50">
          <Download size={16} />
          Export Attendance Report
        </button>
      </div>
    </div>
  );
};
