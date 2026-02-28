// src/pages/AUYExams.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, Badge, Button } from '../components/Common';
import { publicqService } from '../services/publicq.service';
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  PlayCircle,
  CheckCircle,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  duration: number;
  questionCount: number;
  totalPoints: number;
  dueDate: string;
  status: 'available' | 'completed' | 'locked';
}

export const AUYExams: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    loadExamsAndResults();
  }, [courses]);

  const loadExamsAndResults = async () => {
    setLoading(true);
    try {
      const courseIds = courses.map(c => c.courseId);
      const availableExams = await publicqService.getAvailableExams(
        user?.email || '',
        courseIds
      );
      setExams(availableExams);
      const studentResults = await publicqService.getStudentResults(user?.email || '');
      setResults(studentResults);
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (exam: Exam) => {
    const examUrl = publicqService.getExamUrl(
      exam.id,
      user?.email || '',
      user?.displayName || 'Student'
    );
    window.open(examUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (exam: Exam) => {
    const result = results.find(r => r.examId === exam.id);
    const now = new Date();
    const due = new Date(exam.dueDate);

    if (result) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle size={12} />
          {result.percentage}%
        </Badge>
      );
    } else if (due < now) {
      return <Badge variant="warning">Overdue</Badge>;
    } else {
      return <Badge variant="primary">Available</Badge>;
    }
  };

  const availableExams = exams.filter(exam => !results.find(r => r.examId === exam.id));
  const completedExams = exams.filter(exam => results.find(r => r.examId === exam.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0B4F3A]/20 border-t-[#0B4F3A] rounded-full animate-spin"></div>
          <GraduationCap className="absolute inset-0 m-auto text-[#0B4F3A] animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 animate-fadeInDown">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] bg-clip-text text-transparent">
              Exam Portal
            </h1>
            <p className="text-gray-500 mt-1">Powered by PublicQ - AI-Powered Assessment</p>
          </div>
          <div className="flex items-center gap-2 bg-[#e0f2fe] px-4 py-2 rounded-xl">
            <Sparkles className="text-[#0B4F3A]" size={20} />
            <span className="text-sm font-medium text-[#0B4F3A]">AI Monkey Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-[#0B4F3A] text-white rounded-xl">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{availableExams.length}</p>
            <p className="text-sm text-gray-500">Available Exams</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-[#0B4F3A] text-white rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{completedExams.length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-[#0B4F3A] text-white rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {results.length > 0 
                ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
                : 0}%
            </p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'available'
              ? 'text-[#0B4F3A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Available Exams
          {activeTab === 'available' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4F3A] rounded-full" />
          )}
          {availableExams.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {availableExams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'completed'
              ? 'text-[#0B4F3A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4F3A] rounded-full" />
          )}
          {completedExams.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
              {completedExams.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'available' && (
        <>
          {availableExams.length === 0 ? (
            <Card className="p-12 text-center">
              <GraduationCap className="mx-auto text-gray-300 mb-4 animate-float" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exams Available</h3>
              <p className="text-gray-500">You've completed all your exams. Great job!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableExams.map((exam, index) => (
                <Card 
                  key={exam.id} 
                  className="p-6 hover:shadow-2xl transition-all group animate-fadeInUp"
                  style={ { animationDelay: `${index * 0.1}s` } }
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#0B4F3A] transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-sm font-medium text-[#0B4F3A] mt-1">
                        {exam.courseName} â€¢ {exam.courseId}
                      </p>
                    </div>
                    {getStatusBadge(exam)}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{exam.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-[#0B4F3A]" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen size={16} className="text-[#0B4F3A]" />
                      <span>{exam.questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award size={16} className="text-[#0B4F3A]" />
                      <span>{exam.totalPoints} points</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-[#0B4F3A]" />
                      <span>Due {formatDate(exam.dueDate)}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 group"
                    onClick={() => handleStartExam(exam)}
                  >
                    <PlayCircle size={18} className="group-hover:scale-110 transition-transform" />
                    Start Exam
                  </Button>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-1">
                    <span className="text-xs text-gray-400">Powered by</span>
                    <span className="text-xs font-semibold text-[#0B4F3A]">PublicQ</span>
                    <span className="text-xs bg-[#e0f2fe] px-1.5 py-0.5 rounded text-[#0B4F3A] ml-1">
                      AI
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'completed' && (
        <>
          {completedExams.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Completed Exams</h3>
              <p className="text-gray-500">Complete an exam to see your results here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedExams.map((exam, index) => {
                const result = results.find(r => r.examId === exam.id);
                return (
                  <Card 
                    key={exam.id} 
                    className="p-6 hover:shadow-lg transition-all animate-fadeInUp"
                    style={ { animationDelay: `${index * 0.1}s` } }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                          <CheckCircle size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                          <p className="text-sm text-gray-500">{exam.courseName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{result?.percentage}%</p>
                        <p className="text-xs text-gray-400">Score: {result?.score}/{exam.totalPoints}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          Submitted: {formatDate(result?.submittedAt || '')}
                        </span>
                        <span className="text-gray-500">
                          Time: {result?.timeSpent} min
                        </span>
                      </div>
                      <Badge variant={result?.passed ? 'success' : 'warning'}>
                        {result?.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      <Card className="p-4 bg-gradient-to-r from-[#e0f2fe] to-[#d1e9fd] border-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0B4F3A] text-white rounded-full animate-bounce">
            <Sparkles size={16} />
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">AI Monkey Tip:</span> Use PublicQ's AI to generate practice questions and improve your scores!
          </p>
        </div>
      </Card>
    </div>
  );
};
