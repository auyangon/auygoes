import React from 'react';
import { Card } from './Common';
import { Calendar, Clock } from 'lucide-react';

interface ImportantDate {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'holiday' | 'exam' | 'assignment' | 'event';
}

export const ImportantDates: React.FC = () => {
  const dates: ImportantDate[] = [
    {
      id: '1',
      date: '2026-03-30',
      title: 'Thingyan Holiday',
      description: 'University closed',
      type: 'holiday'
    },
    {
      id: '2',
      date: '2026-04-15',
      title: 'Final Exam Schedule',
      description: 'Published',
      type: 'exam'
    },
    {
      id: '3',
      date: '2026-05-01',
      title: 'Library Hours Extended',
      description: 'Open until 10 PM',
      type: 'event'
    },
    {
      id: '4',
      date: '2026-05-15',
      title: 'Last Day of Classes',
      description: 'Spring 2026 semester ends',
      type: 'event'
    },
    {
      id: '5',
      date: '2026-05-20',
      title: 'Final Exams Begin',
      description: 'Check schedule for details',
      type: 'exam'
    }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'holiday': return 'bg-red-100 text-red-700 border-red-200';
      case 'exam': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'assignment': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="text-purple-600" size={20} />
        <h3 className="font-semibold text-[#0a0a0a]">Important Dates</h3>
      </div>

      <div className="space-y-3">
        {dates.map(date => (
          <div 
            key={date.id}
            className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="min-w-[50px] text-center">
              <div className="text-xs text-[#2a2a2a]">
                {new Date(date.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-lg font-bold text-[#0a0a0a]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                {new Date(date.date).getDate()}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium text-[#0a0a0a]">{date.title}</div>
              <div className="text-xs text-[#2a2a2a]">{date.description}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(date.type)}`}>
              {date.type}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

