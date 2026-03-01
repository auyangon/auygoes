import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Card, Badge, ProgressBar } from '../components/Common';
import { 
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  notes?: string;
}

export const CourseAttendance: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, attendanceRecords: allAttendance } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const course = courses.find(c => c.courseId === courseId);
  
  // Filter attendance for this course
  const courseAttendance = allAttendance.filter(
    (record: any) => record.courseId === courseId
  );

  // Calculate stats
  const totalClasses = courseAttendance.length;
  const present = courseAttendance.filter((r: any) => r.status === 'present').length;
  const late = courseAttendance.filter((r: any) => r.status === 'late').length;
  const absent = courseAttendance.filter((r: any) => r.status === 'absent').length;
  const percentage = totalClasses ? Math.round(((present + late) / totalClasses) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present': return <CheckCircle className="text-green-500" size={16} />;
      case 'late': return <Clock className="text-yellow-500" size={16} />;
      case 'absent': return <XCircle className="text-red-500" size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-700';
      case 'late': return 'bg-yellow-100 text-yellow-700';
      case 'absent': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const filteredAttendance = courseAttendance.filter((record: any) => {
    const date = new Date(record.date);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  });

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 px-4 py-2 bg-[#0B4F3A] text-white rounded-lg text-sm"
          >
            Back to Courses
          </button>
        </Card>
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
          <h1 className="text-2xl font-medium text-gray-800">{course.name}</h1>
          <p className="text-sm text-gray-500">{course.courseId} • {course.teacher}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Classes</span>
            <Calendar size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-medium text-gray-800">{totalClasses}</div>
          <div className="text-xs text-gray-400 mt-1">This semester</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Present</span>
            <CheckCircle size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-medium text-green-600">{present}</div>
          <div className="text-xs text-gray-400 mt-1">
            {totalClasses ? Math.round((present/totalClasses)*100) : 0}% of classes
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Late</span>
            <Clock size={16} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-medium text-yellow-600">{late}</div>
          <div className="text-xs text-gray-400 mt-1">
            {totalClasses ? Math.round((late/totalClasses)*100) : 0}% of classes
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Absent</span>
            <XCircle size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-medium text-red-600">{absent}</div>
          <div className="text-xs text-gray-400 mt-1">
            {totalClasses ? Math.round((absent/totalClasses)*100) : 0}% of classes
          </div>
        </Card>
      </div>

      {/* Attendance Progress */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">Attendance Overview</h3>
          <Badge variant={percentage >= 75 ? 'success' : 'warning'}>
            {percentage}% Overall
          </Badge>
        </div>
        <ProgressBar value={percentage} className="h-2" />
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-gray-500">Required: 75%</span>
          <span className={percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
            {percentage >= 75 ? '✅ Meeting requirement' : '⚠️ Below requirement'}
          </span>
        </div>
      </Card>

      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Attendance History</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
            {monthNames[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={handleNextMonth}
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
              <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Day</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAttendance
              .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record: any, idx: number) => {
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
                    <td className="p-4 text-sm text-gray-600">
                      {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="capitalize">{record.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{record.notes || '-'}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {filteredAttendance.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="mx-auto mb-2 text-gray-300" size={32} />
            <p>No attendance records for {monthNames[selectedMonth]} {selectedYear}</p>
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
