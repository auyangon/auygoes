import React, { useState } from 'react';
import { Card } from './Common';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#1a1a1a]">Myanmar Calendar 2026</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-[#1a1a1a]">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-[#1a1a1a]">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="text-center text-[#1a1a1a] mb-2">{monthNames[month]} {year}</div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs text-[#2a2a2a] py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} className="p-1"></div>)}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const holiday = getHoliday(day);
          const today = isToday(day);
          
          return (
            <div key={day} className="relative group">
              <div className={`
                p-1 text-center text-sm rounded cursor-default
                ${holiday ? 'text-amber-600' : 'text-[#1a1a1a]'}
                ${today ? 'bg-gray-100' : ''}
              `}>
                {day}
              </div>
              {holiday && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                  <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    {holiday.title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-[#2a2a2a] flex gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span> Holiday
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-gray-100 border border-gray-300 rounded-full"></span> Today
        </span>
      </div>
    </Card>
  );
};

