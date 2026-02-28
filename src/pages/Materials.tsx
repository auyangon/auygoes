import React from 'react';
import { Card } from '../components/Common';
import { FileText, Download, ExternalLink, BookOpen, Video, File } from 'lucide-react';

export const Materials: React.FC = () => {
  const materials = [
    {
      id: 1,
      title: 'Introduction to Programming',
      type: 'PDF',
      course: 'CS101',
      size: '2.4 MB',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Data Structures Lecture',
      type: 'Video',
      course: 'CS201',
      duration: '45 min',
      icon: Video,
    },
    {
      id: 3,
      title: 'Calculus Notes',
      type: 'PDF',
      course: 'MATH101',
      size: '1.8 MB',
      icon: BookOpen,
    },
    {
      id: 4,
      title: 'Assignment Template',
      type: 'DOC',
      course: 'ENG101',
      size: '0.5 MB',
      icon: File,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">Course Materials</h1>
        <p className="text-gray-500">Access your lecture notes and resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((material) => {
          const Icon = material.icon;
          return (
            <Card key={material.id} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#0B4F3A] flex items-center justify-center text-white shadow-md">
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{material.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{material.course}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-1 bg-[#e0f2fe] text-[#0B4F3A] rounded-full">
                      {material.type}
                    </span>
                    {material.size && (
                      <span className="text-gray-400">{material.size}</span>
                    )}
                    {material.duration && (
                      <span className="text-gray-400">{material.duration}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button className="p-2 text-gray-400 hover:text-[#0B4F3A] transition-colors">
                  <Download size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-[#0B4F3A] transition-colors">
                  <ExternalLink size={18} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-12 text-center">
        <FileText className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">More Materials Coming Soon</h3>
        <p className="text-gray-500">Additional resources will be added throughout the semester.</p>
      </Card>
    </div>
  );
};
