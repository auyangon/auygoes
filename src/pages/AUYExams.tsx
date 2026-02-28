// src/pages/AUYExams.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, SectionTitle, Badge, Button } from '../components/Common';
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  PlayCircle,
  AlertCircle,
  ExternalLink,
  BookOpen
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
  publicqUrl: string;
}

export const AUYExams: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, [courses]);

  const loadExams = () => {
    setLoading(true);
    
    // Map courses to exams based on your timetable
    const courseExams: { [key: string]: Exam[] } = {
      'STAT100': [
        {
          id: 'stat100-mid-001',
          title: 'Statistics Midterm Examination',
          courseId: 'STAT100',
          courseName: 'Introduction to Statistics',
          description: 'Covers descriptive statistics, probability, and basic inferential statistics.',
          duration: 90,
          questionCount: 25,
          totalPoints: 100,
          dueDate: '2026-04-15',
          status: 'available',
          publicqUrl: 'https://publicq.app/exam/stat100-mid-001'
        }
      ],
      'MATH150': [
        {
          id: 'math150-mid-001',
          title: 'Calculus I Midterm',
          courseId: 'MATH150',
          courseName: 'Calculus I',
          description: 'Derivatives, limits, and applications.',
          duration: 120,
          questionCount: 20,
          totalPoints: 100,
          dueDate: '2026-04-20',
          status: 'available',
          publicqUrl: 'https://publicq.app/exam/math150-mid-001'
        }
      ]
    };

    // Filter exams based on student's enrolled courses
    const studentCourseIds = courses.map(c => c.courseId);
    let allExams: Exam[] = [];
    
    studentCourseIds.forEach(courseId => {
      if (courseExams[courseId]) {
        allExams = [...allExams, ...courseExams[courseId]];
      }
    });

    setExams(allExams);
    setLoading(false);
  };

  const handleStartExam = (exam: Exam) => {
    const studentId = encodeURIComponent(user?.email || '');
    const examUrl = `${exam.publicqUrl}?student=${studentId}`;
    window.open(examUrl, '_blank');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B4F3A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F3A] mb-2">Exam Portal</h1>
        <p className="text-gray-500">Powered by PublicQ - AI-powered exam system</p>
      </div>

      {exams.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exams Available</h3>
          <p className="text-gray-500">You don't have any exams scheduled at this time.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{exam.title}</h3>
                  <p className="text-sm font-medium text-[#0B4F3A] mt-1">
                    {exam.courseName} • {exam.courseId}
                  </p>
                </div>
                <Badge variant="primary">Available</Badge>
              </div>

              <p className="text-gray-600 text-sm mb-4">{exam.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-[#0B4F3A]" />
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap size={16} className="text-[#0B4F3A]" />
                  <span>{exam.questionCount} questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle size={16} className="text-[#0B4F3A]" />
                  <span>{exam.totalPoints} points</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-[#0B4F3A]" />
                  <span>Due {formatDate(exam.dueDate)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleStartExam(exam)}
              >
                <PlayCircle size={18} />
                Start Exam
              </Button>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-1">
                <span className="text-xs text-gray-400">Powered by</span>
                <span className="text-xs font-semibold text-[#0B4F3A]">PublicQ</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
