// src/pages/AnnouncementsPage.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle } from '../components/Common';
import { Bell, Calendar } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { announcements } = useData();

  return (
    <MainLayout>
      <SectionTitle icon={<Bell size={20} className="text-[#0B4F3A]" />}>
        All Announcements
      </SectionTitle>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className="p-6">
            <h2 className="text-xl font-semibold text-[#0a0a0a] mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{ann.title}</h2>
            <p className="text-[#1a1a1a] mb-4">{ann.content}</p>
            <div className="flex items-center gap-2 text-sm text-[#2a2a2a]">
              <Calendar size={14} />
              <span>{ann.date}</span>
              <span>•</span>
              <span>{ann.author}</span>
            </div>
          </Card>
        ))}
        {announcements.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-[#2a2a2a]">No announcements yet</p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

