// src/services/firebaseRest.service.ts
// REST API version - no WebSockets, works without VPN

const FIREBASE_URL = "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app";
const API_KEY = "AIzaSyDMaoB6mOKYJOkDGwCmliz0azqtJifbwpY";

class FirebaseRestService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = FIREBASE_URL;
  }

  // Encode email for Firebase path
  encodeEmail(email: string): string {
    if (!email) return '';
    return email.replace(/\./g, ',');
  }

  // Generic GET request
  async get<T>(path: string): Promise<T | null> {
    try {
      const url = `${this.baseUrl}${path}.json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('❌ REST GET error:', error);
      return null;
    }
  }

  // Get student data
  async getStudent(email: string) {
    const encodedEmail = this.encodeEmail(email);
    return this.get<any>(`/students/${encodedEmail}`);
  }

  // Get all students (for debugging)
  async getAllStudents() {
    return this.get<any>('/students');
  }

  // Get attendance records for a student
  async getStudentAttendance(email: string) {
    const encodedEmail = this.encodeEmail(email);
    return this.get<any>(`/attendance`);
  }

  // Get announcements
  async getAnnouncements() {
    return this.get<any>('/announcements');
  }

  // Get courses
  async getCourses() {
    return this.get<any>('/courses');
  }

  // Manual sync function (can be called periodically)
  async syncAll(email: string) {
    const [student, attendance, announcements, courses] = await Promise.all([
      this.getStudent(email),
      this.getStudentAttendance(email),
      this.getAnnouncements(),
      this.getCourses()
    ]);
    
    return {
      student,
      attendance,
      announcements,
      courses,
      timestamp: new Date().toISOString()
    };
  }
}

export const firebaseRest = new FirebaseRestService();
