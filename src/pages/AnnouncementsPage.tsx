import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Card, SectionTitle } from '../components/Common';
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">Announcements</h1>
        <p className="text-gray-500">Stay updated with the latest news and events</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all' 
              ? 'bg-[#0B4F3A] text-white' 
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
          High Priority
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'medium' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Medium
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B4F3A] border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No announcements found</p>
            </Card>
          ) : (
            filteredAnnouncements.map((ann) => (
              <Card key={ann.id} className={`p-6 ${getPriorityColor(ann.priority)}`}>
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
            ))
          )}
        </div>
      )}
    </div>
  );
};
