import React, { useState } from 'react';
import { Card } from './Common';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const holidays = [
    { date: new Date(2026, 0, 4), title: 'Independence Day' },
    { date: new Date(2026, 1, 12), title: 'Union Day' },
    { date: new Date(2026, 2, 2), title: 'Peasants\' Day' },
    { date: new Date(2026, 2, 27), title: 'Armed Forces Day' },
    { date: new Date(2026, 3, 13), title: 'Thingyan Eve' },
    { date: new Date(2026, 3, 14), title: 'Thingyan' },
    { date: new Date(2026, 3, 15), title: 'Thingyan' },
    { date: new Date(2026, 3, 16), title: 'Thingyan' },
    { date: new Date(2026, 3, 17), title: 'Myanmar New Year' },
    { date: new Date(2026, 4, 1), title: 'Labour Day' },
    { date: new Date(2026, 6, 19), title: 'Martyrs\' Day' },
    { date: new Date(2026, 11, 25), title: 'Christmas Day' },
  ];

  const getHoliday = (day: number) => {
    return holidays.find(h => 
      h.date.getDate() === day && 
      h.date.getMonth() === month && 
      h.date.getFullYear() === year
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#0B4F3A]" size={20} />
          <h3 className="font-semibold text-gray-700">Myanmar Calendar 2026</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">←</button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">→</button>
        </div>
      </div>

      <div className="text-center mb-3 font-medium">{monthNames[month]} {year}</div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => <div key={d} className="text-center text-xs text-gray-500">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="p-1"></div>)}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const holiday = getHoliday(day);
          const today = isToday(day);
          
          return (
            <div key={day} className={`relative group ${today ? 'ring-2 ring-[#0B4F3A] rounded' : ''}`}>
              <div className={`p-1 text-center text-sm rounded cursor-pointer hover:bg-gray-100
                ${holiday ? 'bg-amber-50 font-medium text-amber-700' : ''}`}>
                {day}
              </div>
              {holiday && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                  <div className="bg-white text-xs p-1 rounded shadow-lg border whitespace-nowrap">
                    {holiday.title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 text-xs text-gray-500 flex gap-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded"></span> Holiday</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 border-2 border-[#0B4F3A] rounded"></span> Today</span>
      </div>
    </Card>
  );
};
