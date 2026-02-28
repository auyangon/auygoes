// src/services/exam/exam.service.ts
import { examDatabase, emailToFirebaseKey } from '../../firebase-exam/config';
import { ref, push, set, get, update, query, orderByChild, equalTo, remove } from 'firebase/database';
import { Exam, ExamAttempt, ExamViolation, ExamResult } from '../../types/exam/exam.types';

class ExamService {
  // ========== EXAM CRUD OPERATIONS ==========
  
  async createExam(examData: Omit<Exam, 'id' | 'createdAt'>): Promise<string> {
    try {
      const examsRef = ref(examDatabase, 'exams');
      const newExamRef = push(examsRef);
      
      await set(newExamRef, {
        ...examData,
        createdAt: new Date().toISOString(),
        status: examData.status || 'draft'
      });
      
      console.log(' Exam created with ID:', newExamRef.key);
      return newExamRef.key!;
    } catch (error) {
      console.error(' Error creating exam:', error);
      throw error;
    }
  }

  async getExam(examId: string): Promise<Exam | null> {
    try {
      const examRef = ref(examDatabase, exams/);
      const snapshot = await get(examRef);
      
      if (snapshot.exists()) {
        return { id: examId, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error(' Error getting exam:', error);
      throw error;
    }
  }

  async getAllExams(): Promise<Exam[]> {
    try {
      const examsRef = ref(examDatabase, 'exams');
      const snapshot = await get(examsRef);
      
      const exams: Exam[] = [];
      snapshot.forEach((child) => {
        exams.push({ id: child.key, ...child.val() });
      });
      
      return exams;
    } catch (error) {
      console.error(' Error getting all exams:', error);
      throw error;
    }
  }

  async getCourseExams(courseId: string): Promise<Exam[]> {
    try {
      const examsRef = ref(examDatabase, 'exams');
      const courseQuery = query(examsRef, orderByChild('courseId'), equalTo(courseId));
      const snapshot = await get(courseQuery);
      
      const exams: Exam[] = [];
      snapshot.forEach((child) => {
        exams.push({ id: child.key, ...child.val() });
      });
      
      return exams;
    } catch (error) {
      console.error(' Error getting course exams:', error);
      throw error;
    }
  }

  async updateExam(examId: string, updates: Partial<Exam>): Promise<void> {
    try {
      const examRef = ref(examDatabase, exams/);
      await update(examRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      console.log(' Exam updated:', examId);
    } catch (error) {
      console.error(' Error updating exam:', error);
      throw error;
    }
  }

  async deleteExam(examId: string): Promise<void> {
    try {
      const examRef = ref(examDatabase, exams/);
      await remove(examRef);
      console.log(' Exam deleted:', examId);
    } catch (error) {
      console.error(' Error deleting exam:', error);
      throw error;
    }
  }

  // ========== EXAM ATTEMPT OPERATIONS ==========

  async startExamAttempt(examId: string, studentEmail: string, studentName?: string): Promise<string> {
    try {
      const emailKey = emailToFirebaseKey(studentEmail);
      const attemptsRef = ref(examDatabase, ttempts//);
      
      const attempt: Omit<ExamAttempt, 'id'> = {
        examId,
        studentId: emailKey,
        studentEmail,
        studentName,
        answers: {},
        violations: [],
        startedAt: new Date().toISOString(),
        status: 'in-progress'
      };
      
      await set(attemptsRef, attempt);
      console.log(' Exam attempt started for:', studentEmail);
      return emailKey;
    } catch (error) {
      console.error(' Error starting exam attempt:', error);
      throw error;
    }
  }

  async getExamAttempt(examId: string, studentEmail: string): Promise<ExamAttempt | null> {
    try {
      const emailKey = emailToFirebaseKey(studentEmail);
      const attemptRef = ref(examDatabase, ttempts//);
      const snapshot = await get(attemptRef);
      
      if (snapshot.exists()) {
        return { id: emailKey, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error(' Error getting exam attempt:', error);
      throw error;
    }
  }

  async submitExamAttempt(
    examId: string, 
    studentEmail: string, 
    answers: Record<string, any>
  ): Promise<ExamResult> {
    try {
      const emailKey = emailToFirebaseKey(studentEmail);
      const attemptRef = ref(examDatabase, ttempts//);
      
      // Get the exam to calculate score
      const exam = await this.getExam(examId);
      if (!exam) {
        throw new Error('Exam not found');
      }
      
      // Calculate score
      let score = 0;
      exam.questions.forEach((question, index) => {
        const userAnswer = answers[q];
        if (question.correctAnswer && userAnswer === question.correctAnswer) {
          score += question.points;
        }
      });
      
      const percentage = (score / exam.totalPoints) * 100;
      const passed = percentage >= exam.passingScore;
      const timeSpent = Math.floor((Date.now() - new Date(exam.createdAt).getTime()) / 1000);
      
      const attemptData = {
        answers,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        score,
        percentage,
        passed,
        timeSpent
      };
      
      await update(attemptRef, attemptData);
      
      // Also save to results for easy querying
      const resultsRef = ref(examDatabase, esults//);
      await set(resultsRef, {
        examId,
        examTitle: exam.title,
        studentId: emailKey,
        studentEmail,
        score,
        percentage,
        passed,
        submittedAt: new Date().toISOString(),
        timeSpent
      });
      
      console.log(' Exam submitted for:', studentEmail);
      
      return {
        examId,
        examTitle: exam.title,
        studentId: emailKey,
        studentEmail,
        score,
        percentage,
        passed,
        submittedAt: new Date().toISOString(),
        timeSpent
      };
    } catch (error) {
      console.error(' Error submitting exam:', error);
      throw error;
    }
  }

  async logViolation(
    examId: string, 
    studentEmail: string, 
    violation: Omit<ExamViolation, 'timestamp'>
  ): Promise<void> {
    try {
      const emailKey = emailToFirebaseKey(studentEmail);
      const violationsRef = ref(examDatabase, ttempts///violations);
      const newViolationRef = push(violationsRef);
      
      await set(newViolationRef, {
        ...violation,
        timestamp: new Date().toISOString()
      });
      
      console.log(' Violation logged:', violation.type);
    } catch (error) {
      console.error(' Error logging violation:', error);
    }
  }

  async getStudentAttempts(studentEmail: string): Promise<ExamAttempt[]> {
    try {
      const emailKey = emailToFirebaseKey(studentEmail);
      const resultsRef = ref(examDatabase, esults/);
      const snapshot = await get(resultsRef);
      
      const attempts: ExamAttempt[] = [];
      snapshot.forEach((child) => {
        attempts.push({ id: child.key, ...child.val() });
      });
      
      return attempts;
    } catch (error) {
      console.error(' Error getting student attempts:', error);
      throw error;
    }
  }

  async getStudentResults(studentEmail: string): Promise<ExamResult[]> {
    try {
      const emailKey = emailToFirebaseKey(studentEmail);
      const resultsRef = ref(examDatabase, esults/);
      const snapshot = await get(resultsRef);
      
      const results: ExamResult[] = [];
      snapshot.forEach((child) => {
        results.push(child.val());
      });
      
      return results.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    } catch (error) {
      console.error(' Error getting student results:', error);
      throw error;
    }
  }
}

export const examService = new ExamService();
