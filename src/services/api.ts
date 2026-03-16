const API_URL = import.meta.env.VITE_API_URL;

async function fetchSheet(sheetName) {
  const res = await fetch(`${API_URL}/${sheetName}`);
  // OpenSheet returns array directly, no wrapper
  return await res.json();
}

export const api = {
  // GET methods
  getUsers: () => fetchSheet('Users'),
  getStudents: () => fetchSheet('Students'),
  getCourses: () => fetchSheet('Courses'),
  getEnrollments: () => fetchSheet('Enrollments'),
  getAttendanceSummary: () => fetchSheet('AttendanceSummary'),
  getMaterials: () => fetchSheet('Materials'),
  getSchedule: () => fetchSheet('Schedule'),
  getDeadlines: () => fetchSheet('Deadlines'),
  getAnnouncements: () => fetchSheet('Announcements'),
  getStudentNotifications: () => fetchSheet('StudentNotifications'),

  // Auth helper
  authenticateUser: async (email, password) => {
    const users = await api.getUsers();
    return users.find(u => u.email === email && u.password === password) || null;
  },
  getStudentByEmail: async (email) => {
    const students = await api.getStudents();
    return students.find(s => s.email === email) || null;
  },

  // Student-specific data
  getStudentEnrollments: async (studentId) => {
    const enrollments = await api.getEnrollments();
    return enrollments.filter(e => e.studentId === studentId);
  },
  getStudentAttendance: async (studentId) => {
    const attendance = await api.getAttendanceSummary();
    return attendance.filter(a => a.studentId === studentId);
  },
  getCourseMaterials: async (courseIds) => {
    const materials = await api.getMaterials();
    return materials.filter(m => courseIds.includes(m.courseId));
  },
  getCourseSchedule: async (courseIds) => {
    const schedule = await api.getSchedule();
    return schedule.filter(s => courseIds.includes(s.courseId));
  },
  getCourseDeadlines: async (courseIds) => {
    const deadlines = await api.getDeadlines();
    return deadlines.filter(d => courseIds.includes(d.courseId));
  },
  getStudentAnnouncements: async (courseIds) => {
    const announcements = await api.getAnnouncements();
    return announcements.filter(a => a.targetAudience === 'ALL' || courseIds.includes(a.targetAudience));
  },
  getNotificationsForStudent: async (studentId) => {
    const notifications = await api.getStudentNotifications();
    return notifications.filter(n => n.studentId === studentId);
  },
};
