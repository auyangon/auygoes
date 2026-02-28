// src/pages/AnnouncementsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Calendar, Megaphone, AlertCircle, Info } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    setLoading(true);
    
    // Sample announcements based on your timetable
    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        title: '📢 STAT100 Class Update',
        content: 'STAT100 class on Monday 09:00-10:30 at LA campus. Please bring your calculators.',
        date: '2026-03-15',
        author: 'Statistics Department',
        priority: 'medium',
        category: 'Class Update'
      },
      {
        id: '2',
        title: '🎓 MATH150 Midterm Announcement',
        content: 'MATH150 midterm exam scheduled for next Tuesday. Location: LA campus, Room 201.',
        date: '2026-03-16',
        author: 'Mathematics Department',
        priority: 'high',
        category: 'Exam'
      },
      {
        id: '3',
        title: '📝 HUM11 Assignment Due',
        content: 'Humanities 11 final paper due next week. Submit via Google Classroom.',
        date: '2026-03-17',
        author: 'Humanities Department',
        priority: 'high',
        category: 'Assignment'
      },
      {
        id: '4',
        title: '🗣️ LING6 Language Lab',
        content: 'LING6 language lab session this Wednesday at 12:00. Location: LA campus, Language Lab.',
        date: '2026-03-18',
        author: 'Linguistics Department',
        priority: 'medium',
        category: 'Lab Session'
      },
      {
        id: '5',
        title: '🏫 Campus Closure - Thingyan',
        content: 'University closed March 30 - April 4 for Thingyan holiday. No classes.',
        date: '2026-03-21',
        author: 'Admin',
        priority: 'high',
        category: 'Holiday'
      }
    ];
    
    setAnnouncements(sampleAnnouncements);
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'medium': return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white';
      default: return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <AlertCircle className="text-red-500" size={20} />;
      case 'medium': return <Info className="text-yellow-500" size={20} />;
      default: return <Bell className="text-blue-500" size={20} />;
    }
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.priority === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-600 mt-1">Stay updated with the latest news and events</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'high' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔴 High Priority
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'medium' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🟡 Medium
          </button>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((ann) => (
              <div 
                key={ann.id} 
                className={`bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition ${getPriorityColor(ann.priority)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getPriorityIcon(ann.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">{ann.title}</h2>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{ann.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(ann.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span>•</span>
                      <span>By: {ann.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
