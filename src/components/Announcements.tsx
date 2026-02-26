import React from 'react';
import { GlassCard } from './Common';
import { Bell, Clock } from 'lucide-react';

interface Announcement {
  title: string;
  content: string;
  createdAt: Date | string;
}

interface AnnouncementsProps {
  announcements?: Announcement[];
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements = [] }) => {
  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return ${diffMins} minute ago;
    if (diffHours < 24) return ${diffHours} hour ago;
    return ${diffDays} day ago;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={18} className="text-gray-700" />
        <h3 className="text-base font-medium text-gray-700">Announcements</h3>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((ann, index) => (
            <div key={index} className="border-l-2 border-pastel-blue pl-3">
              <p className="text-sm font-medium text-gray-700">{ann.title}</p>
              <p className="text-xs text-gray-600 mt-1">{ann.content}</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500">
                  {formatTime(ann.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No announcements yet</p>
        )}
      </div>
    </GlassCard>
  );
};
