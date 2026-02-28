// src/components/CalendarWidget.tsx
import React, { useState } from 'react';
import { Card } from './Common';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  date: Date;
  title: string;
  type: 'academic' | 'holiday';
}

interface CalendarWidgetProps {
  events?: Event[];
  className?: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ 
  events = [],
  className 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // Myanmar Public Holidays 2026
  const myanmarHolidays: Event[] = [
    // Independence Day
    { date: new Date(2026, 0, 4), title: 'Independence Day', type: 'holiday' },
    
    // Union Day
    { date: new Date(2026, 1, 12), title: 'Union Day', type: 'holiday' },
    
    // Peasants' Day
    { date: new Date(2026, 2, 2), title: 'Peasants\' Day', type: 'holiday' },
    
    // Thingyan (Water Festival) - Dates may vary, typically mid-April
    { date: new Date(2026, 3, 13), title: 'Thingyan Eve', type: 'holiday' },
    { date: new Date(2026, 3, 14), title: 'Thingyan (Day 1)', type: 'holiday' },
    { date: new Date(2026, 3, 15), title: 'Thingyan (Day 2)', type: 'holiday' },
    { date: new Date(2026, 3, 16), title: 'Thingyan (Day 3)', type: 'holiday' },
    { date: new Date(2026, 3, 17), title: 'Myanmar New Year', type: 'holiday' },
    
    // Labour Day
    { date: new Date(2026, 4, 1), title: 'Labour Day', type: 'holiday' },
    
    // Full Moon of Kasong (Buddha Day)
    { date: new Date(2026, 4, 29), title: 'Full Moon of Kasong', type: 'holiday' },
    
    // Martyrs' Day
    { date: new Date(2026, 6, 19), title: 'Martyrs\' Day', type: 'holiday' },
    
    // Full Moon of Waso (Beginning of Buddhist Lent)
    { date: new Date(2026, 7, 27), title: 'Full Moon of Waso', type: 'holiday' },
    
    // Full Moon of Thadingyut (End of Buddhist Lent)
    { date: new Date(2026, 9, 25), title: 'Full Moon of Thadingyut', type: 'holiday' },
    
    // Full Moon of Tazaungmon
    { date: new Date(2026, 10, 23), title: 'Full Moon of Tazaungmon', type: 'holiday' },
    
    // National Day
    { date: new Date(2026, 11, 9), title: 'National Day', type: 'holiday' },
    
    // Christmas Day
    { date: new Date(2026, 11, 25), title: 'Christmas Day', type: 'holiday' },
    
    // Kayin New Year
    { date: new Date(2026, 11, 28), title: 'Kayin New Year', type: 'holiday' },
  ];

  // Combine provided events with Myanmar holidays
  const allEvents = [...events, ...myanmarHolidays];
  
  const getEventsForDay = (day: number) => {
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year;
    });
  };

  return (
    <Card className={`p-6 ${className || ''}`} glass={true}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-[#0B4F3A]" size={20} />
          <h3 className="text-base font-semibold text-gray-800">Myanmar Calendar 2026</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-[#e0f2fe] transition-all text-gray-600 hover:text-[#0B4F3A]"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-[#e0f2fe] transition-all text-gray-600 hover:text-[#0B4F3A]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Month and Year */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h3>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square p-1"></div>
        ))}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const isHoliday = dayEvents.some(e => e.type === 'holiday');
          const isAcademic = dayEvents.some(e => e.type === 'academic');
          const today = isToday(day);
          
          // Get holiday names for tooltip
          const holidayNames = dayEvents
            .filter(e => e.type === 'holiday')
            .map(e => e.title)
            .join(', ');
          
          return (
            <div 
              key={day} 
              className={`aspect-square p-1 rounded-lg transition-all cursor-pointer relative group ${
                today ? 'ring-2 ring-[#0B4F3A] ring-offset-2' : ''
              }`}
            >
              <div className={`h-full flex flex-col items-center justify-start p-1 rounded-lg transition-all ${
                isHoliday 
                  ? 'bg-amber-50 hover:bg-amber-100' 
                  : isAcademic
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'bg-white/50 backdrop-blur-sm hover:bg-[#e0f2fe]'
              }`}>
                <span className={`text-sm font-medium ${
                  today ? 'text-[#0B4F3A] font-bold' : 
                  isHoliday ? 'text-amber-700' : 'text-gray-700'
                }`}>
                  {day}
                </span>
                {isHoliday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1"></div>
                )}
                {isAcademic && !isHoliday && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                )}
                
                {/* Tooltip on hover */}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-white shadow-xl rounded-lg py-2 px-3 whitespace-nowrap border border-gray-100">
                      {dayEvents.map((event, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-1 pt-1 border-t border-gray-100' : ''}>
                          <span className={`font-medium ${
                            event.type === 'holiday' ? 'text-amber-700' : 'text-blue-700'
                          }`}>
                            {event.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Myanmar Public Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Academic Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-[#0B4F3A]"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
