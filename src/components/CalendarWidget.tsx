import React, { useState } from 'react';
import { GlassCard } from './Common';
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
    <GlassCard className={p-6 }>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-jet" size={20} />
          <h3 className="text-base font-normal text-jet">Academic Calendar</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 glass-dark rounded-lg hover:glass-light transition-all"
          >
            <ChevronLeft size={16} className="text-jet" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 glass-dark rounded-lg hover:glass-light transition-all"
          >
            <ChevronRight size={16} className="text-jet" />
          </button>
        </div>
      </div>

      {/* Month and Year */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-normal text-jet">
          {monthNames[month]} {year}
        </h3>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-jet/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={empty-} className="aspect-square p-1"></div>
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
              className={
                aspect-square p-1 rounded-lg transition-all cursor-pointer relative group
                
              }
            >
              <div className="h-full flex flex-col items-center justify-start p-1">
                <span className={
                  text-sm font-medium
                  
                }>
                  {day}
                </span>
                <div className="flex gap-0.5 mt-1">
                  {hasAcademic && (
                    <div className="w-1.5 h-1.5 rounded-full bg-seafoam-dark"></div>
                  )}
                  {hasHoliday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  )}
                </div>
                
                {/* Tooltip on hover */}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="glass-dark text-jet text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                      {dayEvents.map((event, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-1 pt-1 border-t border-seafoam-soft/30' : ''}>
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
      <div className="mt-6 pt-4 border-t border-seafoam-soft/30">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-seafoam-dark"></div>
            <span className="text-jet/70">Academic Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-jet/70">Public Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full glass-dark ring-2 ring-seafoam-soft"></div>
            <span className="text-jet/70">Today</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

