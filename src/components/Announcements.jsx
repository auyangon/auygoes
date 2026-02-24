// src/components/Announcements.jsx
import { Bell, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Announcements({ announcements = [] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={18} className="text-emerald-400" />
        <h3 className="font-semibold">Announcements</h3>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((ann, index) => (
            <div key={index} className="border-l-2 border-emerald-500 pl-3">
              <p className="text-sm font-medium">{ann.title}</p>
              <p className="text-xs text-gray-400 mt-1">{ann.content}</p>
              <div className="flex items-center gap-1 mt-2">
                <Clock size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(ann.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No announcements yet</p>
        )}
      </div>
    </div>
  );
}