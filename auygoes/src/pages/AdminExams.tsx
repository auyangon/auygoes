// src/pages/AdminExams.tsx
import React, { useState, useEffect } from 'react';
import { examService } from '../services/exam/exam.service';
import { Plus, Edit, Trash, Copy, Eye } from 'lucide-react';
import type { Exam } from '../types/exam/exam.types';

export const AdminExams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Partial<Exam> | null>(null);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const allExams = await examService.getAllExams();
      setExams(allExams);
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingExam) return;
    
    try {
      if (editingExam.id) {
        await examService.updateExam(editingExam.id, editingExam);
      } else {
        await examService.createExam(editingExam as any);
      }
      await loadExams();
      setShowModal(false);
      setEditingExam(null);
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    
    try {
      await examService.deleteExam(examId);
      await loadExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Exams</h1>
        <button
          onClick={() => {
            setEditingExam({
              title: '',
              description: '',
              courseId: '',
              duration: 60,
              totalPoints: 100,
              passingScore: 60,
              questions: [],
              settings: {
                shuffleQuestions: true,
                shuffleOptions: true,
                allowReview: false,
                showResults: true,
                maxAttempts: 1,
                timeLimit: 60,
                antiCheating: {
                  fullscreen: true,
                  preventTabSwitch: true,
                  preventCopyPaste: true,
                  preventRightClick: true,
                  faceDetection: false,
                  randomizeQuestions: true,
                  ipTracking: true
                }
              },
              createdBy: 'admin',
              status: 'draft'
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} /> Create Exam
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                    <div className="text-sm text-gray-500">{exam.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{exam.courseId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{exam.duration} min</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{exam.questions.length}</td>
                  <td className="px-6 py-4">
                    <span className={px-2 py-1 text-xs rounded-full }>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingExam(exam);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
