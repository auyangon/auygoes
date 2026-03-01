import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/Common';
import { Database, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const DataVerify: React.FC = () => {
  const { 
    courses, 
    announcements, 
    attendanceRecords, 
    studentName, 
    studentEmail, 
    loading,
    refreshData 
  } = useData();
  
  const [verifying, setVerifying] = useState(false);

  const handleRefresh = () => {
    setVerifying(true);
    refreshData();
    setTimeout(() => setVerifying(false), 1000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Data Verification</h1>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B4F3A] text-white rounded-lg text-sm hover:bg-[#0d5f45]"
        >
          <RefreshCw size={16} className={verifying ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Student Info */}
      <Card className="p-5">
        <h2 className="text-lg font-medium text-[#0a0a0a] mb-3" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Student Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[#2a2a2a]">Name</p>
            <p className="font-medium">{studentName || 'Not loaded'}</p>
          </div>
          <div>
            <p className="text-sm text-[#2a2a2a]">Email</p>
            <p className="font-medium">{studentEmail || 'Not loaded'}</p>
          </div>
        </div>
      </Card>

      {/* Data Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#2a2a2a]">Courses</p>
              <p className="text-2xl font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{courses.length}</p>
            </div>
            {courses.length > 0 ? 
              <CheckCircle className="text-green-500" size={24} /> : 
              <XCircle className="text-red-500" size={24} />
            }
          </div>
          {courses.length > 0 && (
            <p className="text-xs text-[#2a2a2a] mt-2">{courses.map(c => c.courseId).join(', ')}</p>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#2a2a2a]">Attendance Records</p>
              <p className="text-2xl font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{attendanceRecords.length}</p>
            </div>
            {attendanceRecords.length > 0 ? 
              <CheckCircle className="text-green-500" size={24} /> : 
              <XCircle className="text-red-500" size={24} />
            }
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#2a2a2a]">Announcements</p>
              <p className="text-2xl font-medium" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{announcements.length}</p>
            </div>
            {announcements.length > 0 ? 
              <CheckCircle className="text-green-500" size={24} /> : 
              <XCircle className="text-red-500" size={24} />
            }
          </div>
        </Card>
      </div>

      {/* Raw Data */}
      <Card className="p-5">
        <h2 className="text-lg font-medium text-[#0a0a0a] mb-3 flex items-center gap-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
          <Database size={20} />
          Raw Firebase Data
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-xs">
            {JSON.stringify({
              student: { name: studentName, email: studentEmail },
              courses: courses.map(c => ({
                id: c.courseId,
                name: c.name,
                grade: c.grade,
                attendance: c.attendancePercentage
              })),
              attendance: attendanceRecords.slice(0, 5),
              announcements: announcements.slice(0, 3)
            }, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
};

