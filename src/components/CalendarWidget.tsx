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
  
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year;
    });
  };

  return (
    <Card className={`p-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-700" size={20} />
          <h3 className="text-base font-medium text-gray-700">Academic Calendar</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 bg-pastel-blue/20 rounded-lg hover:bg-pastel-blue/30 transition-all"
          >
            <ChevronLeft size={16} className="text-gray-700" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 bg-pastel-blue/20 rounded-lg hover:bg-pastel-blue/30 transition-all"
          >
            <ChevronRight size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Month and Year */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">
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
        {/* Empty cells for days before month starts */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square p-1"></div>
        ))}
        
        {/* Days of month */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const hasAcademic = dayEvents.some(e => e.type === 'academic');
          const hasHoliday = dayEvents.some(e => e.type === 'holiday');
          const today = isToday(day);
          
          return (
            <div 
              key={day} 
              className={`aspect-square p-1 rounded-lg transition-all cursor-pointer relative group ${
                today ? 'ring-2 ring-pastel-purple' : ''
              }`}
            >
              <div className="h-full flex flex-col items-center justify-start p-1">
                <span className="text-sm font-medium">
                  {day}
                </span>
                <div className="flex gap-0.5 mt-1">
                  {hasAcademic && (
                    <div className="w-1.5 h-1.5 rounded-full bg-pastel-blue"></div>
                  )}
                  {hasHoliday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  )}
                </div>
                
                {/* Tooltip on hover */}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-white text-gray-700 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg border border-pastel-peach">
                      {dayEvents.map((event, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-1 pt-1 border-t border-pastel-peach' : ''}>
                          <span className="font-medium">{event.title}</span>
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
      <div className="mt-6 pt-4 border-t border-pastel-peach">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pastel-blue"></div>
            <span className="text-gray-600">Academic Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Public Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pastel-blue ring-2 ring-pastel-purple"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
