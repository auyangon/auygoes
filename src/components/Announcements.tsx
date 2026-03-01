import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Card } from './Common';
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

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch announcements from Firebase
    const announcementsRef = ref(db, 'announcements');
    
    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const announcementsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort by date (newest first)
        announcementsArray.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAnnouncements(announcementsArray);
      } else {
        setAnnouncements([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Megaphone className="text-purple-600" size={20} />
        <h3 className="font-semibold text-gray-800">Latest Announcements</h3>
        {announcements.length > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {announcements.length} total
          </span>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          <Bell className="mx-auto mb-2 text-gray-300" size={32} />
          <p>No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {announcements.slice(0, 5).map(ann => (
            <div 
              key={ann.id} 
              className={`p-3 rounded-lg ${getPriorityColor(ann.priority)}`}
            >
              <div className="flex items-start gap-2">
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
