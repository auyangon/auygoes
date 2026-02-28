// src/pages/Exam/ExamResults.tsx
import React, { useState } from 'react';
import { useExams } from '../../contexts/exam/ExamContext';
import { Award, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

export const ExamResults: React.FC = () => {
  const { examResults, loading } = useExams();
  const [selectedResult, setSelectedResult] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (examResults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <Award className="mx-auto text-gray-300 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Results Yet</h2>
        <p className="text-gray-600">Complete some exams to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {examResults.map((result) => (
        <div
          key={${result.examId}-}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{result.examTitle}</h3>
                {result.passed ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> Passed
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                    <XCircle size={12} /> Failed
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Score</p>
                  <p className="text-xl font-bold text-gray-800">{result.score}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Percentage</p>
                  <p className={	ext-xl font-bold }>
                    {result.percentage.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Spent</p>
                  <p className="text-sm font-medium text-gray-700">
                    {Math.floor(result.timeSpent / 60)} min {result.timeSpent % 60} sec
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedResult(result)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
            >
              View Details
            </button>
          </div>
        </div>
      ))}

      {/* Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Exam Details</h2>
            <p className="text-gray-600 mb-4">{selectedResult.examTitle}</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-2xl font-bold">{selectedResult.score}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-500">Percentage</p>
                  <p className="text-2xl font-bold">{selectedResult.percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedResult(null)}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
