// src/services/publicq.service.ts
interface PublicQConfig {
  baseUrl: string;
  apiKey?: string;
}

interface PublicQExam {
  id: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  totalPoints: number;
  dueDate: string;
  status: 'available' | 'completed' | 'locked';
  courseId: string;
  courseName: string;
}

interface PublicQResult {
  examId: string;
  studentId: string;
  score: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  timeSpent: number;
}

class PublicQService {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: PublicQConfig) {
    this.baseUrl = config.baseUrl || 'https://publicq.app/api';
    this.apiKey = config.apiKey || '';
  }

  // Get available exams for a student
  async getAvailableExams(studentId: string, courseIds: string[]): Promise<PublicQExam[]> {
    try {
      // In a real implementation, this would fetch from PublicQ API
      // For now, return mock data based on courses
      const mockExams: PublicQExam[] = [];
      
      const examTemplates: { [key: string]: PublicQExam[] } = {
        'STAT100': [
          {
            id: 'stat100-mid-001',
            title: 'Statistics Midterm Examination',
            description: 'Covers descriptive statistics, probability, and basic inferential statistics.',
            duration: 90,
            questionCount: 25,
            totalPoints: 100,
            dueDate: '2026-04-15',
            status: 'available',
            courseId: 'STAT100',
            courseName: 'Introduction to Statistics'
          },
          {
            id: 'stat100-quiz-001',
            title: 'Probability Quiz',
            description: 'Quiz on probability rules and distributions.',
            duration: 30,
            questionCount: 10,
            totalPoints: 20,
            dueDate: '2026-03-25',
            status: 'available',
            courseId: 'STAT100',
            courseName: 'Introduction to Statistics'
          }
        ],
        'MATH150': [
          {
            id: 'math150-mid-001',
            title: 'Calculus I Midterm',
            description: 'Derivatives, limits, and applications.',
            duration: 120,
            questionCount: 20,
            totalPoints: 100,
            dueDate: '2026-04-20',
            status: 'available',
            courseId: 'MATH150',
            courseName: 'Calculus I'
          }
        ],
        'HUM11': [
          {
            id: 'hum11-essay-001',
            title: 'Humanities Essay',
            description: 'Analysis of Renaissance art and literature.',
            duration: 180,
            questionCount: 3,
            totalPoints: 50,
            dueDate: '2026-05-01',
            status: 'available',
            courseId: 'HUM11',
            courseName: 'Introduction to Humanities'
          }
        ],
        'LING6': [
          {
            id: 'ling6-quiz-001',
            title: 'Phonetics Quiz',
            description: 'Quiz on phonetics and phonology.',
            duration: 45,
            questionCount: 15,
            totalPoints: 30,
            dueDate: '2026-03-28',
            status: 'available',
            courseId: 'LING6',
            courseName: 'Introduction to Linguistics'
          }
        ],
        'ENG10': [
          {
            id: 'eng10-mid-001',
            title: 'English Composition',
            description: 'Essay writing and grammar review.',
            duration: 90,
            questionCount: 2,
            totalPoints: 40,
            dueDate: '2026-04-10',
            status: 'available',
            courseId: 'ENG10',
            courseName: 'English Composition'
          }
        ],
        'CFS38': [
          {
            id: 'cfs38-quiz-001',
            title: 'Career Development Quiz',
            description: 'Quiz on resume writing and interview skills.',
            duration: 30,
            questionCount: 12,
            totalPoints: 25,
            dueDate: '2026-03-30',
            status: 'available',
            courseId: 'CFS38',
            courseName: 'Career and Professional Development'
          }
        ]
      };

      courseIds.forEach(courseId => {
        if (examTemplates[courseId]) {
          mockExams.push(...examTemplates[courseId]);
        }
      });

      return mockExams;
    } catch (error) {
      console.error('Error fetching exams from PublicQ:', error);
      return [];
    }
  }

  // Get exam results for a student
  async getStudentResults(studentId: string): Promise<PublicQResult[]> {
    try {
      // Mock results data
      return [
        {
          examId: 'stat100-quiz-001',
          studentId: studentId,
          score: 18,
          percentage: 90,
          passed: true,
          submittedAt: new Date().toISOString(),
          timeSpent: 25
        }
      ];
    } catch (error) {
      console.error('Error fetching results from PublicQ:', error);
      return [];
    }
  }

  // Generate exam URL with student authentication
  getExamUrl(examId: string, studentId: string, studentName: string): string {
    // In production, this would include a JWT token or session ID
    const params = new URLSearchParams({
      studentId: studentId,
      studentName: studentName,
      embed: 'true',
      theme: 'auy'
    });
    
    return `${this.baseUrl}/exam/${examId}?${params.toString()}`;
  }

  // Submit exam results back to AUY (optional)
  async submitResults(results: PublicQResult): Promise<boolean> {
    try {
      // This would sync results back to your Firebase
      console.log('Submitting results to AUY:', results);
      return true;
    } catch (error) {
      console.error('Error submitting results:', error);
      return false;
    }
  }
}

export const publicqService = new PublicQService({
  baseUrl: process.env.REACT_APP_PUBLICQ_URL || 'https://publicq.app',
  apiKey: process.env.REACT_APP_PUBLICQ_API_KEY
});

