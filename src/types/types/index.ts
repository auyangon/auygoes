// =====================================================
// AUY Student Portal - Type Definitions
// EXACTLY matches Google Sheets column names
// =====================================================

// Students Sheet
export interface Student {
  email: string;
  studentId: string;
  studentName: string;
  major: string;
  studyMode: string;
  intake: string;
  status: string;
  gpa: string;
  profileImage: string;
  createdAt: string;
  questLink?: string;  // Optional link to assignment
}

// Courses Sheet
export interface Course {
  courseCode: string;
  courseName: string;
  credits: string;
  department: string;
  instructor: string;
  instructorEmail: string;
  googleClassroomLink: string;
  status: string;
}

// Enrollments Sheet
export interface Enrollment {
  id: string;
  email: string;
  courseCode: string;
  semester: string;
  enrollmentStatus: string;
  grade: string;
  gpaPoints: string;
}

// Schedule Sheet
export interface Schedule {
  scheduleId: string;
  courseCode: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  zoomLink: string;
}

// Materials Sheet
export interface Material {
  materialId: string;
  courseCode: string;
  title: string;
  type: string;
  fileUrl: string;
  week: string;
  uploadedBy: string;
  uploadDate: string;
}

// Announcements Sheet
export interface Announcement {
  announcementId: string;
  title: string;
  content: string;
  audience: string;
  courseCode: string;
  createdAt: string;
  questLink?: string;  // Optional link to assignment
  createdBy: string;
}

// Attendance Sheet
export interface Attendance {
  id: string;
  email: string;
  courseCode: string;
  date: string;
  status: string;
}

// Quests Sheet
export interface Quest {
  questId: string;
  courseCode: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  maxScore: string;
  status: string;
  createdAt: string;
  questLink?: string;  // Optional link to assignment
}

// StudentQuests Sheet
export interface StudentQuest {
  id: string;
  email: string;
  questId: string;
  status: string;
  score: string;
  submissionLink: string;
  submittedAt: string;
  gradedAt: string;
  feedback: string;
}

// Requests Sheet
export interface Request {
  requestId: string;
  email: string;
  type: string;
  status: string;
  submittedAt: string;
  resolvedAt: string;
  adminNote: string;
}

// Navigation Types
export type NavigationPage = 
  | dashboard | courses | quests | materials | schedule | attendance | announcements | requests;

// App State Types
export interface AppState {
  currentStudent: Student | null;
  enrollments: Enrollment[];
  courses: Course[];
  schedules: Schedule[];
  materials: Material[];
  announcements: Announcement[];
  attendance: Attendance[];
  quests: Quest[];
  studentQuests: StudentQuest[];
  requests: Request[];
  isLoading: boolean;
  error: string | null;
}


