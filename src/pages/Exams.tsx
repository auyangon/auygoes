import React from 'react';
import { Card, Badge } from '../components/Common';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

export const Exams: React.FC = () => {
  const exams = [
    {
      id: 1,
      course: 'Introduction to Business',
      code: 'BUS101',
      date: '2026-03-15',
      time: '09:00 AM',
      duration: '2 hours',
      room: 'Hall A',
      type: 'Midterm'
    },
    {
      id: 2,
      course: 'English Composition',
      code: 'ENG101',
      date: '2026-03-17',
      time: '02:00 PM',
      duration: '1.5 hours',
      room: 'Room 205',
      type: 'Midterm'
    },
    {
      id: 3,
      course: 'College Mathematics',
      code: 'MATH101',
      date: '2026-03-19',
      time: '10:30 AM',
      duration: '2 hours',
      room: 'Science Hall',
      type: 'Midterm'
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = (dateStr: string) => {
    const examDate = new Date(dateStr);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Exam Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">Midterm Examination Schedule</p>
        </div>
        <Badge variant="warning">Upcoming Exams</Badge>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {exams.map((exam) => {
          const upcoming = isUpcoming(exam.date);
          return (
            <Card key={exam.id} className={`p-6 hover:shadow-xl transition-all ${
              upcoming ? 'border-2 border-orange-200' : ''
            }`}>
              {upcoming && (
                <div className="flex items-center gap-2 text-orange-600 text-sm mb-3">
                  <AlertCircle size={16} />
                  <span className="font-medium">Upcoming in the next 7 days</span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{exam.course}</h3>
                  <p className="text-sm text-gray-500">{exam.code}</p>
                </div>
                <Badge variant="primary">{exam.type}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-purple-500" />
                  <span className="text-sm">{formatDate(exam.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-sm">{exam.time} ({exam.duration})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-green-500" />
                  <span className="text-sm">{exam.room}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <h3 className="text-lg font-semibold mb-2">Exam Guidelines</h3>
        <ul className="space-y-2 text-sm text-white/90">
          <li>• Arrive at least 15 minutes before the exam starts</li>
          <li>• Bring your student ID card</li>
          <li>• Electronic devices are not permitted</li>
          <li>• Check your exam venue beforehand</li>
        </ul>
      </Card>
    </div>
  );
};
