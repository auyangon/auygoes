// src/pages/PublicQExams.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  status: 'available' | 'completed' | 'locked';
}

export const PublicQExams: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading exams
    setTimeout(() => {
      setExams([
        {
          id: '1',
          title: 'JavaScript Fundamentals',
          description: 'Test your knowledge of JavaScript basics',
          duration: 60,
          questionCount: 20,
          status: 'available'
        },
        {
          id: '2',
          title: 'React Advanced Concepts',
          description: 'Advanced React patterns and hooks',
          duration: 90,
          questionCount: 15,
          status: 'available'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (selectedExam) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <button 
            onClick={() => setSelectedExam(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back to Exams
          </button>
          <span className="text-gray-600 font-medium">Exam in progress...</span>
        </div>
        <iframe
          src={`https://publicq.app/exam/${selectedExam}?embed=true`}
          className="w-full flex-1 border-0"
          title="PublicQ Exam"
          allow="fullscreen"
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Exams</h1>
        <p className="text-gray-600 mt-1">Powered by PublicQ</p>
      </div>

      {exams.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-500">No exams available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{exam.title}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                    {exam.questionCount} Qs
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{exam.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500">⏱️ Duration: {exam.duration} minutes</p>
                </div>

                <button
                  onClick={() => setSelectedExam(exam.id)}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Start Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
