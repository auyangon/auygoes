// src/services/exam/portal.service.ts
import { database } from '../../firebase/config';
import { ref, get } from 'firebase/database';

class PortalService {
  // Get student data from MAIN Firebase
  async getStudentData(email: string) {
    try {
      const emailKey = email.replace(/\./g, ',,,');
      const studentRef = ref(database, students/);
      const snapshot = await get(studentRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error('Error getting student data:', error);
      throw error;
    }
  }

  // Get student courses from MAIN Firebase
  async getStudentCourses(email: string) {
    try {
      const emailKey = email.replace(/\./g, ',,,');
      const coursesRef = ref(database, students//courses);
      const snapshot = await get(coursesRef);
      
      const courses = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          courses.push({
            id: child.key,
            ...child.val()
          });
        });
      }
      return courses;
    } catch (error) {
      console.error('Error getting student courses:', error);
      throw error;
    }
  }

  // Get course details from MAIN Firebase
  async getCourseDetails(courseId: string) {
    try {
      const courseRef = ref(database, courses/);
      const snapshot = await get(courseRef);
      
      if (snapshot.exists()) {
        return {
          id: courseId,
          ...snapshot.val()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting course details:', error);
      throw error;
    }
  }
}

export const portalService = new PortalService();
