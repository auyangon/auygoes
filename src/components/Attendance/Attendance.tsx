import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock, HiOutlineAcademicCap, HiOutlineQrcode } from 'react-icons/hi';
import { useStudent } from '../context/StudentContext';

export function Attendance() {
  const { attendance, getEnrolledCourses } = useStudent();
  const [showQR, setShowQR] = useState(false);
  const enrolledCourses = getEnrolledCourses();

  const courseData = useMemo(() => {
    return enrolledCourses.map(course => {
      const records = attendance.filter(a => a.courseCode === course.courseCode);
      const total = records.length;
      if (total === 0) return { ...course, present: 0, late: 0, absent: 0, rate: 0 };
      const present = records.filter(a => a.status === 'Present').length;
      const late = records.filter(a => a.status === 'Late').length;
      const absent = records.filter(a => a.status === 'Absent').length;
      const rate = Math.round((present + late) / total * 100);
      return { ...course, present, late, absent, rate, total };
    });
  }, [enrolledCourses, attendance]);

  const totalPresent = attendance.filter(a => a.status === 'Present').length;
  const totalLate = attendance.filter(a => a.status === 'Late').length;
  const totalAbsent = attendance.filter(a => a.status === 'Absent').length;
  const overallRate = attendance.length ? Math.round((totalPresent + totalLate) / attendance.length * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-seafoam-900">Attendance</h1>
        <button onClick={() => setShowQR(true)} className="px-4 py-2 rounded-xl text-white" style={{ background: '#1b5f56' }}>
          <HiOutlineQrcode className="inline mr-2" /> QR Check-in
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Present', value: totalPresent, icon: HiOutlineCheckCircle, color: '#10b981' },
          { label: 'Late', value: totalLate, icon: HiOutlineClock, color: '#f59e0b' },
          { label: 'Absent', value: totalAbsent, icon: HiOutlineXCircle, color: '#ef4444' },
          { label: 'Rate', value: overallRate + '%', icon: HiOutlineAcademicCap, color: '#1b5f56' }
        ].map((s, i) => (
          <div key={i} className="bg-white/80 rounded-xl p-4 shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '20' }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 rounded-xl p-6">
        <h2 className="font-semibold mb-4">By Course</h2>
        {courseData.map(c => (
          <div key={c.courseCode} className="mb-4">
            <div className="flex justify-between"><span>{c.courseName}</span><span>{c.rate}%</span></div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1"><div className="h-full rounded-full" style={{ width: c.rate + '%', background: c.rate >= 90 ? '#10b981' : c.rate >= 75 ? '#f59e0b' : '#ef4444' }} /></div>
            <div className="flex gap-3 text-xs mt-1"><span className="text-green-600">✓ {c.present}</span><span className="text-amber-500">⏰ {c.late}</span><span className="text-red-500">✗ {c.absent}</span></div>
          </div>
        ))}
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 text-center max-w-md w-full">
            <HiOutlineQrcode size={48} className="mx-auto mb-4 text-seafoam-600" />
            <h3 className="text-lg font-semibold mb-2">QR Check-in</h3>
            <p className="text-gray-500 mb-4">Scan QR code from your teacher</p>
            <button onClick={() => setShowQR(false)} className="w-full py-2 rounded-xl text-white" style={{ background: '#1b5f56' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
