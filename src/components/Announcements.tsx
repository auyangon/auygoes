import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Card } from './Common';
import { Bell, Calendar, Megaphone } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const announcementsRef = ref(db, 'announcements');
    
    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const announcementsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        announcementsArray.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAnnouncements(announcementsArray);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
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
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          <Bell className="mx-auto mb-2 text-gray-300" size={32} />
          <p>No announcements</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {announcements.slice(0, 5).map(ann => (
            <div key={ann.id} className="p-3 rounded-lg bg-gray-50 border-l-4 border-l-blue-500">
              <h4 className="font-medium text-gray-800 text-sm">{ann.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{ann.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Calendar size={10} />
                <span>{formatDate(ann.date)}</span>
                <span>•</span>
                <span>{ann.author}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
