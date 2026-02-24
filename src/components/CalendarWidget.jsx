// src/components/CalendarWidget.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Sample important dates (you'll fetch these from Firebase)
  const importantDates = [
    new Date(2024, 1, 15), // Feb 15
    new Date(2024, 1, 28), // Feb 28
  ];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Calendar</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-white/5 rounded">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-white/5 rounded">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const isImportant = importantDates.some(d => isSameDay(d, day));
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                p-2 text-sm rounded-lg transition relative
                ${!isSameMonth(day, currentDate) ? 'text-gray-600' : ''}
                ${isSelected ? 'bg-gradient-primary text-white' : 'hover:bg-white/5'}
              `}
            >
              {format(day, 'd')}
              {isImportant && !isSelected && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-glass-border">
        <p className="text-sm text-gray-400">Selected: {format(selectedDate, 'MMMM d, yyyy')}</p>
        <p className="text-xs text-emerald-400 mt-1">2 important dates this month</p>
      </div>
    </div>
  );
}