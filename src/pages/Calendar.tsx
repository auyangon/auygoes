// src/pages/Calendar.tsx
import React, { useState } from 'react';
import { Card, SectionTitle, Badge } from '../components/Common';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Cloud
} from 'lucide-react';

interface Holiday {
  date: Date;
  name: string;
  type: 'public' | 'academic' | 'cultural';
  description?: string;
}

export const Calendar: React.FC = () => {
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
  const myanmarHolidays: Holiday[] = [
    { date: new Date(2026, 0, 4), name: 'Independence Day', type: 'public', description: 'Marks independence from British rule in 1948' },
    { date: new Date(2026, 1, 12), name: 'Union Day', type: 'public', description: 'Anniversary of the Panglong Agreement in 1947' },
    { date: new Date(2026, 2, 2), name: 'Peasants\' Day', type: 'public', description: 'Honoring farmers and agricultural workers' },
    { date: new Date(2026, 2, 27), name: 'Armed Forces Day', type: 'public', description: 'Celebrates the beginning of resistance against Japanese occupation' },
    { date: new Date(2026, 3, 13), name: 'Thingyan Eve', type: 'cultural', description: 'Eve of Water Festival' },
    { date: new Date(2026, 3, 14), name: 'Thingyan (Day 1)', type: 'cultural', description: 'Water Festival - Traditional New Year celebrations' },
    { date: new Date(2026, 3, 15), name: 'Thingyan (Day 2)', type: 'cultural', description: 'Water Festival continues' },
    { date: new Date(2026, 3, 16), name: 'Thingyan (Day 3)', type: 'cultural', description: 'Water Festival continues' },
    { date: new Date(2026, 3, 17), name: 'Myanmar New Year', type: 'public', description: 'Traditional New Year Day' },
    { date: new Date(2026, 4, 1), name: 'Labour Day', type: 'public', description: 'International Workers\' Day' },
    { date: new Date(2026, 4, 29), name: 'Full Moon of Kasong', type: 'cultural', description: 'Buddha\'s birth, enlightenment, and passing' },
    { date: new Date(2026, 6, 19), name: 'Martyrs\' Day', type: 'public', description: 'Remembers General Aung San and other leaders assassinated in 1947' },
    { date: new Date(2026, 7, 27), name: 'Full Moon of Waso', type: 'cultural', description: 'Beginning of Buddhist Lent' },
    { date: new Date(2026, 9, 25), name: 'Full Moon of Thadingyut', type: 'cultural', description: 'End of Buddhist Lent - Festival of Lights' },
    { date: new Date(2026, 10, 23), name: 'Full Moon of Tazaungmon', type: 'cultural', description: 'Festival of Floating Lights' },
    { date: new Date(2026, 11, 9), name: 'National Day', type: 'public', description: 'Commemorates the first university students\' strike in 1920' },
    { date: new Date(2026, 11, 25), name: 'Christmas Day', type: 'public', description: 'Christian holiday celebrating the birth of Jesus' },
    { date: new Date(2026, 11, 28), name: 'Kayin New Year', type: 'cultural', description: 'Traditional New Year of the Kayin people' }
  ];

  const academicEvents: Holiday[] = [
    { date: new Date(2026, 0, 10), name: 'Spring Semester Begins', type: 'academic' },
    { date: new Date(2026, 2, 20), name: 'Midterm Examinations', type: 'academic' },
    { date: new Date(2026, 4, 15), name: 'Final Examinations Begin', type: 'academic' },
    { date: new Date(2026, 4, 30), name: 'Spring Semester Ends', type: 'academic' },
    { date: new Date(2026, 5, 1), name: 'Summer Session Begins', type: 'academic' },
  ];

  const allEvents = [...myanmarHolidays, ...academicEvents];
  
  const getEventsForDay = (day: number) => {
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === month &&
             eventDate.getFullYear() === year;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'public': return 'bg-red-500';
      case 'cultural': return 'bg-purple-500';
      case 'academic': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fadeInDown">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] bg-clip-text text-transparent">
          Academic Calendar 2026
        </h1>
        <p className="text-gray-500 mt-1">Myanmar public holidays and academic events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-red-500 text-white rounded-lg">
            <Sun size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Public Holidays</p>
            <p className="text-xl font-bold text-gray-800">{myanmarHolidays.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-500 text-white rounded-lg">
            <Moon size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cultural Events</p>
            <p className="text-xl font-bold text-gray-800">
              {myanmarHolidays.filter(h => h.type === 'cultural').length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500 text-white rounded-lg">
            <CalendarIcon size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Academic Events</p>
            <p className="text-xl font-bold text-gray-800">{academicEvents.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2 bg-[#0B4F3A] text-white rounded-lg">
            <Cloud size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-xl font-bold text-gray-800">{allEvents.length}</p>
          </div>
        </Card>
      </div>

      {/* Calendar Widget */}
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-[#0B4F3A]" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              {monthNames[month]} {year}
            </h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-[#e0f2fe] transition-all text-gray-600 hover:text-[#0B4F3A]"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-[#e0f2fe] transition-all text-gray-600 hover:text-[#0B4F3A]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
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
            const today = isToday(day);
            
            return (
              <div 
                key={day} 
                className={`aspect-square p-1 rounded-lg transition-all cursor-pointer relative group ${
                  today ? 'ring-2 ring-[#0B4F3A] ring-offset-2' : ''
                }`}
              >
                <div className={`h-full flex flex-col items-center justify-start p-2 rounded-lg transition-all ${
                  dayEvents.length > 0 
                    ? 'bg-gradient-to-br from-[#e0f2fe] to-[#d1e9fd] hover:from-[#d1e9fd] hover:to-[#c0e0fc]' 
                    : 'bg-white/50 backdrop-blur-sm hover:bg-[#e0f2fe]'
                }`}>
                  <span className={`text-sm font-medium ${
                    today ? 'text-[#0B4F3A] font-bold' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-gray-500">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Tooltip */}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50 min-w-[200px]">
                      <Card className="p-3">
                        <p className="font-semibold text-gray-800 mb-2">
                          {monthNames[month]} {day}, {year}
                        </p>
                        <div className="space-y-2">
                          {dayEvents.map((event, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`} />
                                <span className="font-medium text-gray-700">{event.name}</span>
                              </div>
                              {event.description && (
                                <p className="text-xs text-gray-500 ml-4">{event.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
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
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Public Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-gray-600">Cultural Event</span>
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

      {/* Upcoming Events */}
      <SectionTitle icon={<Sparkles size={20} className="text-[#0B4F3A]" />}>
        Upcoming Events
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allEvents
          .filter(event => new Date(event.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 6)
          .map((event, index) => (
            <Card key={index} className="p-4 flex items-center gap-4 hover:shadow-lg transition-all">
              <div className={`p-3 rounded-xl ${getEventTypeColor(event.type)} bg-opacity-20`}>
                <CalendarIcon className={getEventTypeColor(event.type).replace('bg-', 'text-')} size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{event.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                {event.description && (
                  <p className="text-xs text-gray-400 mt-1">{event.description}</p>
                )}
              </div>
              <Badge variant={
                event.type === 'public' ? 'warning' :
                event.type === 'cultural' ? 'info' : 'primary'
              }>
                {event.type}
              </Badge>
            </Card>
          ))}
      </div>
    </div>
  );
};
