// src/pages/AnnouncementsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, SectionTitle, Badge } from '../components/Common';
import { Calendar, Bell, AlertCircle, Info } from 'lucide-react';

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
    
    const sampleAnnouncements: Announcement[] = [
      {
        id: '1',
        title: '🏫 Thingyan Holiday Announcement',
        content: 'University will be closed from March 30 to April 4 for Thingyan celebrations.',
        date: '2026-03-15',
        author: 'Admin',
        priority: 'high',
        category: 'Holiday'
      },
      {
        id: '2',
        title: '📝 Final Exam Schedule Published',
        content: 'The final examination schedule for May 2026 has been published.',
        date: '2026-03-16',
        author: 'Academic Office',
        priority: 'high',
        category: 'Academic'
      },
      {
        id: '3',
        title: '📚 Library Hours Extended',
        content: 'The library will be open until 10 PM starting May 1st.',
        date: '2026-03-17',
        author: 'Library',
        priority: 'medium',
        category: 'Facility'
      },
      {
        id: '4',
        title: '📢 STAT100 Class Update',
        content: 'STAT100 class on Monday 09:00-10:30 at LA campus.',
        date: '2026-03-18',
        author: 'Statistics Department',
        priority: 'medium',
        category: 'Class Update'
      },
      {
        id: '5',
        title: '🎓 MATH150 Midterm',
        content: 'MATH150 midterm exam scheduled for next Tuesday.',
        date: '2026-03-19',
        author: 'Mathematics Department',
        priority: 'high',
        category: 'Exam'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">
          Announcements
        </h1>
        <p className="text-gray-500">Stay updated with the latest news and events</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' 
              ? 'bg-[#0B4F3A] text-white' 
              : 'bg-white text-gray-600 hover:bg-[#e0f2fe]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'high' 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-[#e0f2fe]'
          }`}
        >
          High Priority
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'medium' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-[#e0f2fe]'
          }`}
        >
          Medium
        </button>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B4F3A] border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <Card key={ann.id} className={`p-6 ${getPriorityColor(ann.priority)}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getPriorityIcon(ann.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-700">{ann.title}</h2>
                    <Badge variant="default">{ann.category}</Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{ann.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(ann.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <span>By: {ann.author}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
