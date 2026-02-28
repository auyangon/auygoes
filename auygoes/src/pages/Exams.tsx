// src/pages/Exams.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExams } from '../contexts/exam/ExamContext';
import { ExamInterface } from './Exam/ExamInterface';
import { ExamResults } from './Exam/ExamResults';
import { Clock, Calendar, AlertCircle, Award, BookOpen } from 'lucide-react';

export const Exams: React.FC = () => {
  const { user } = useAuth();
  const { availableExams, examResults, loading, refreshResults } = useExams();
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'results'>('available');

  const handleExamComplete = async () => {
    await refreshResults();
    setSelectedExam(null);
    setActiveTab('results');
  };

  if (selectedExam) {
    return (
      <ExamInterface
        exam={selectedExam}
        studentEmail={user?.email || ''}
        studentName={user?.displayName || ''}
        onComplete={handleExamComplete}
        onCancel={() => setSelectedExam(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Exams</h1>
        <p className="text-gray-600 mt-1">View and take your course exams</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={px-4 py-2 font-medium transition-colors relative }
        >
          Available Exams
          {availableExams.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {availableExams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={px-4 py-2 font-medium transition-colors }
        >
          My Results
        </button>
      </div>

      {activeTab === 'available' ? (
        // Available Exams
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : availableExams.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Exams Available</h2>
              <p className="text-gray-600">There are no exams scheduled for your courses at this time.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableExams.map((exam) => (
                <div key={exam.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{exam.title}</h3>
                        <p className="text-sm text-gray-500">{exam.courseName}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {exam.totalPoints} pts
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>Duration: {exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AlertCircle size={16} />
                        <span>Passing: {exam.passingScore}%</span>
                      </div>
                      {exam.startDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} />
                          <span>Available: {new Date(exam.startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedExam(exam)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <ExamResults />
      )}
    </div>
  );
};
