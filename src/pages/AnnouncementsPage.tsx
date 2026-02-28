import React, { useState } from 'react';
import { Announcements } from '../components/Announcements';
import { ImportantDates } from '../components/ImportantDates';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card } from '../components/Common';
import { Bell, Calendar, Filter } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [filter, setFilter] = useState<string>('all');
  
  const userCourseIds = courses.map(c => c.courseId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-500 mt-1">Stay updated with the latest news and events</p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={px-4 py-2 rounded-lg text-sm transition }
            >
              All
            </button>
            <button
              onClick={() => setFilter('courses')}
              className={px-4 py-2 rounded-lg text-sm transition }
            >
              My Courses
            </button>
            <button
              onClick={() => setFilter('important')}
              className={px-4 py-2 rounded-lg text-sm transition }
            >
              Important
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Announcements Column */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-purple-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-800">Latest Updates</h2>
              </div>
              <Announcements 
                userEmail={user?.email} 
                userCourses={userCourseIds}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ImportantDates />
            
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
                  📢 General Announcements
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
                  📝 Academic Updates
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
                  🏫 Campus Events
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600">
                  ⚠️ Urgent Notices
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
