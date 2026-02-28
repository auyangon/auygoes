import React, { useState, useEffect } from 'react';
import { Card } from './Common';
import { Bell, Calendar, Megaphone, AlertCircle, Info, X } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  targetCourses?: string;
}

interface AnnouncementsProps {
  userEmail?: string;
  userCourses?: string[];
}

export const Announcements: React.FC<AnnouncementsProps> = ({ userEmail, userCourses = [] }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    setLoading(true);
    
    const cached = localStorage.getItem('announcements');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setAnnouncements(parsed);
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached announcements', e);
      }
    }

    fetchAnnouncements();
  };

  const fetchAnnouncements = async () => {
    try {
      const sampleAnnouncements: Announcement[] = [
        {
          id: '1',
          title: '📢 STAT100 Class Update',
          content: 'STAT100 class on Monday 09:00-10:30 at LA campus. Please bring your calculators.',
          date: '2026-03-15',
          author: 'Statistics Department',
          priority: 'medium',
          category: 'Class Update',
          targetCourses: 'STAT100'
        },
        {
          id: '2',
          title: '🎓 MATH150 Midterm Announcement',
          content: 'MATH150 midterm exam scheduled for next Tuesday. Location: LA campus, Room 201.',
          date: '2026-03-16',
          author: 'Mathematics Department',
          priority: 'high',
          category: 'Exam',
          targetCourses: 'MATH150'
        },
        {
          id: '3',
          title: '📝 HUM11 Assignment Due',
          content: 'Humanities 11 final paper due next week. Submit via Google Classroom.',
          date: '2026-03-17',
          author: 'Humanities Department',
          priority: 'high',
          category: 'Assignment',
          targetCourses: 'HUM11'
        },
        {
          id: '4',
          title: '🗣️ LING6 Language Lab',
          content: 'LING6 language lab session this Wednesday at 12:00. Location: LA campus, Language Lab.',
          date: '2026-03-18',
          author: 'Linguistics Department',
          priority: 'medium',
          category: 'Lab Session',
          targetCourses: 'LING6'
        },
        {
          id: '5',
          title: '📚 ENG10 Reading Materials',
          content: 'English 10 reading materials posted on Google Classroom. Check the "Resources" section.',
          date: '2026-03-19',
          author: 'English Department',
          priority: 'low',
          category: 'Materials',
          targetCourses: 'ENG10'
        },
        {
          id: '6',
          title: '💼 CFS38 Career Workshop',
          content: 'CFS38 career workshop this Friday. Guest speaker from industry.',
          date: '2026-03-20',
          author: 'Career Services',
          priority: 'medium',
          category: 'Workshop',
          targetCourses: 'CFS38'
        },
        {
          id: '7',
          title: '🏫 Campus Closure - Thingyan',
          content: 'University closed March 30 - April 4 for Thingyan holiday. No classes.',
          date: '2026-03-21',
          author: 'Admin',
          priority: 'high',
          category: 'Holiday',
          targetCourses: 'ALL'
        },
        {
          id: '8',
          title: '📊 STAT100 Tutorial Session',
          content: 'Extra tutorial session for STAT100 on Friday at 2 PM. Optional but recommended.',
          date: '2026-03-22',
          author: 'Statistics Department',
          priority: 'low',
          category: 'Tutorial',
          targetCourses: 'STAT100'
        }
      ];
      
      setAnnouncements(sampleAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  };

  const dismissAnnouncement = (id: string) => {
    setDismissed([...dismissed, id]);
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <AlertCircle className="text-red-500" size={16} />;
      case 'medium': return <Info className="text-yellow-500" size={16} />;
      default: return <Bell className="text-blue-500" size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'medium': return 'border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white';
      default: return 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const visibleAnnouncements = announcements
    .filter(a => !dismissed.includes(a.id))
    .filter(a => a.targetCourses === 'ALL' || 
           (userCourses && a.targetCourses?.split(',').some(c => userCourses.includes(c.trim()))))
    .slice(0, 5);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Megaphone className="text-purple-600" size={20} />
          <h3 className="font-semibold text-gray-800">Latest Announcements</h3>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (visibleAnnouncements.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Megaphone className="text-purple-600" size={20} />
          <h3 className="semibold text-gray-800">Latest Announcements</h3>
        </div>
        <div className="text-center py-6 text-gray-500 text-sm">
          <Bell className="mx-auto mb-2 text-gray-300" size={32} />
          <p>No new announcements</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Megaphone className="text-purple-600" size={20} />
          <h3 className="font-semibold text-gray-800">Latest Announcements</h3>
          {visibleAnnouncements.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {visibleAnnouncements.length} new
            </span>
          )}
        </div>
        <button 
          onClick={loadAnnouncements}
          className="text-xs text-purple-600 hover:text-purple-800"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {visibleAnnouncements.map(ann => (
          <div 
            key={ann.id} 
            className={`p-3 rounded-lg relative group ${getPriorityColor(ann.priority)}`}
          >
            <button
              onClick={() => dismissAnnouncement(ann.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
            
            <div className="flex items-start gap-2 pr-6">
              <div className="mt-0.5">
                {getPriorityIcon(ann.priority)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-gray-800 text-sm">{ann.title}</h4>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                    {ann.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{ann.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDate(ann.date)}
                  </span>
                  <span>•</span>
                  <span>{ann.author}</span>
                  {ann.targetCourses !== 'ALL' && (
                    <>
                      <span>•</span>
                      <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full text-[10px]">
                        {ann.targetCourses}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length > 5 && (
        <div className="mt-3 pt-2 border-t border-gray-100 text-center">
          <button className="text-xs text-purple-600 hover:text-purple-800">
            View all {announcements.length} announcements
          </button>
        </div>
      )}
    </Card>
  );
};
