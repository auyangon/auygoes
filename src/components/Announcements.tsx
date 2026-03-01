import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Card } from './Common';
import { Bell, Calendar } from 'lucide-react';

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
        // Sort by date (newest first)
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
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 0) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-gray-700 mb-3">Latest Announcements</h3>
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
      <h3 className="text-gray-700 mb-3">Latest Announcements</h3>

      {announcements.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Bell className="mx-auto mb-2 text-gray-300" size={32} />
          <p className="text-sm">No announcements</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.slice(0, 3).map(ann => (
            <div key={ann.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <h4 className="text-gray-800 text-base">{ann.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{ann.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Calendar size={12} />
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
