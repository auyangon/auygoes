import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiGrid,
  FiBell,
  FiBookOpen,
  FiLogOut,
  FiSearch,
  FiChevronDown,
  FiX,
  FiExternalLink,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiUser,
  FiMenu,
  FiChevronRight,
  FiDownload,
  FiPlay,
  FiLink,
  FiMail,
  FiCopy,
  FiBarChart2,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

/** ------------------------------------------------------------
 * Types - Exact field names from Google Sheets
 * ----------------------------------------------------------*/

interface Student {
  studentId: string;
  email: string;
  studentName: string;
  major: string;
  studyMode: string;
  status: string;
  softrRecordId: string;
}

interface User {
  email: string;
  password: string;
  role: string;
}

interface Materials {
  materialId: string;
  courseId: string;
  title: string;
  type: string;
  description: string;
  fileUrl: string;
  uploadedBy: string;
  uploadDate: string;
  week: string;
  tags: string;
}

interface Schedule {
  scheduleId: string;
  courseId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  type: string;
  recurring: string;
  startDate: string;
  endDate: string;
}

interface Deadline {
  deadlineId: string;
  courseId: string;
  title: string;
  type: string;
  dueDate: string;
  dueTime: string;
  weight: string;
  description: string;
  submissionLink: string;
}

interface Enrollment {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  email: string;
  studyMode: string;
  major: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  credits: string;
  grade: string;
  googleClassroomLink: string;
  attendance: string;
  lastUpdated: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: string;
  category: string;
  targetCourses: string;
}

// Course interface embedded in Enrollment type - using enrollment.courseName, enrollment.teacherName, etc.

interface AttendanceSummary {
  studentId: string;
  courseId: string;
  totalClasses: string;
  present: string;
  late: string;
  absent: string;
  percentage: string;
  lastUpdated: string;
}

interface StudentNotification {
  studentId: string;
  email: string;
  announcementId: string;
  read: string;
  readAt: string;
}

/** ------------------------------------------------------------
 * Mock Data - Complete dataset from provided sheets
 * ----------------------------------------------------------*/

const MOCK_STUDENTS: Student[] = [
  {
    studentId: "AUY2024001",
    email: "thant.soe@auy.edu.mm",
    studentName: "Thant Soe",
    major: "Computer Science",
    studyMode: "Full-time",
    status: "Active",
    softrRecordId: "rec_a1B2c3D4e5F6g7",
  },
  {
    studentId: "AUY2024002",
    email: "mayzin.thu@auy.edu.mm",
    studentName: "May Zin Thu",
    major: "Business Administration",
    studyMode: "Part-time",
    status: "Active",
    softrRecordId: "rec_b2C3d4E5f6G7h8",
  },
];

const MOCK_USERS: User[] = [
  { email: "thant.soe@auy.edu.mm", password: "auy2024", role: "student" },
  { email: "mayzin.thu@auy.edu.mm", password: "auy2024", role: "student" },
  { email: "demo@auy.edu.mm", password: "demo123", role: "student" },
];

// Note: MOCK_COURSES data type is defined but individual course data is embedded in MOCK_ENROLLMENTS
// and accessed through student enrollments for proper filtering by studentId

const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    enrollmentId: "ENR001",
    studentId: "AUY2024001",
    studentName: "Thant Soe",
    email: "thant.soe@auy.edu.mm",
    studyMode: "Full-time",
    major: "Computer Science",
    courseId: "CS101",
    courseName: "Introduction to Programming",
    teacherName: "Dr. Hla Hla Win",
    credits: "3",
    grade: "A-",
    googleClassroomLink: "https://classroom.google.com/c/CS101",
    attendance: "92%",
    lastUpdated: "2025-01-08",
  },
  {
    enrollmentId: "ENR002",
    studentId: "AUY2024001",
    studentName: "Thant Soe",
    email: "thant.soe@auy.edu.mm",
    studyMode: "Full-time",
    major: "Computer Science",
    courseId: "CS201",
    courseName: "Data Structures & Algorithms",
    teacherName: "Prof. Aung Kyaw",
    credits: "4",
    grade: "B+",
    googleClassroomLink: "https://classroom.google.com/c/CS201",
    attendance: "88%",
    lastUpdated: "2025-01-08",
  },
  {
    enrollmentId: "ENR003",
    studentId: "AUY2024001",
    studentName: "Thant Soe",
    email: "thant.soe@auy.edu.mm",
    studyMode: "Full-time",
    major: "Computer Science",
    courseId: "MATH150",
    courseName: "Calculus I",
    teacherName: "Dr. Myo Min Thein",
    credits: "4",
    grade: "A",
    googleClassroomLink: "https://classroom.google.com/c/MATH150",
    attendance: "95%",
    lastUpdated: "2025-01-08",
  },
];

const MOCK_SCHEDULE: Schedule[] = [
  {
    scheduleId: "SCH001",
    courseId: "CS101",
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room 201, Science Building",
    instructor: "Dr. Hla Hla Win",
    type: "Lecture",
    recurring: "true",
    startDate: "2025-01-06",
    endDate: "2025-05-15",
  },
  {
    scheduleId: "SCH002",
    courseId: "CS201",
    dayOfWeek: "Tuesday",
    startTime: "13:00",
    endTime: "15:00",
    room: "Lab 3, Tech Center",
    instructor: "Prof. Aung Kyaw",
    type: "Lab",
    recurring: "true",
    startDate: "2025-01-07",
    endDate: "2025-05-15",
  },
  {
    scheduleId: "SCH003",
    courseId: "MATH150",
    dayOfWeek: "Wednesday",
    startTime: "10:45",
    endTime: "12:15",
    room: "Room 105, Main Hall",
    instructor: "Dr. Myo Min Thein",
    type: "Lecture",
    recurring: "true",
    startDate: "2025-01-08",
    endDate: "2025-05-15",
  },
  {
    scheduleId: "SCH004",
    courseId: "CS101",
    dayOfWeek: "Thursday",
    startTime: "14:00",
    endTime: "15:30",
    room: "Room 201, Science Building",
    instructor: "Dr. Hla Hla Win",
    type: "Tutorial",
    recurring: "true",
    startDate: "2025-01-09",
    endDate: "2025-05-15",
  },
];

const MOCK_DEADLINES: Deadline[] = [
  {
    deadlineId: "DL001",
    courseId: "CS101",
    title: "Programming Assignment 3: Arrays and Strings",
    type: "Assignment",
    dueDate: "2025-01-15",
    dueTime: "23:59",
    weight: "15%",
    description: "Implement a contact management system using arrays and string manipulation. Must include add, delete, search, and display functions.",
    submissionLink: "https://classroom.google.com/c/CS101/a/DL001/submissions",
  },
  {
    deadlineId: "DL002",
    courseId: "CS201",
    title: "Midterm Project: Binary Search Tree Implementation",
    type: "Project",
    dueDate: "2025-01-18",
    dueTime: "17:00",
    weight: "25%",
    description: "Create a fully functional BST with insert, delete, search, traversal methods. Include complexity analysis in comments.",
    submissionLink: "https://classroom.google.com/c/CS201/a/DL002/submissions",
  },
  {
    deadlineId: "DL003",
    courseId: "MATH150",
    title: "Quiz 2: Derivatives and Applications",
    type: "Quiz",
    dueDate: "2025-01-20",
    dueTime: "10:45",
    weight: "10%",
    description: "In-class quiz covering chain rule, implicit differentiation, and related rates problems.",
    submissionLink: "https://classroom.google.com/c/MATH150/a/DL003/submissions",
  },
];

const MOCK_MATERIALS: Materials[] = [
  {
    materialId: "MAT001",
    courseId: "CS101",
    title: "Lecture 4 Slides - Arrays in C++",
    type: "PDF",
    description: "Comprehensive slides covering one-dimensional and two-dimensional arrays, memory allocation, and common patterns.",
    fileUrl: "https://drive.google.com/file/d/MAT001/view",
    uploadedBy: "Dr. Hla Hla Win",
    uploadDate: "2025-01-06",
    week: "4",
    tags: "arrays, c++, lecture, slides",
  },
  {
    materialId: "MAT002",
    courseId: "CS201",
    title: "BST Implementation Walkthrough Video",
    type: "Video",
    description: "Step-by-step video demonstrating insertion and deletion in Binary Search Trees with live coding.",
    fileUrl: "https://youtube.com/watch?v=MAT002",
    uploadedBy: "Prof. Aung Kyaw",
    uploadDate: "2025-01-07",
    week: "5",
    tags: "binary search tree, video, algorithms, walkthrough",
  },
  {
    materialId: "MAT003",
    courseId: "MATH150",
    title: "Practice Problems Set 3",
    type: "PDF",
    description: "30 additional practice problems on derivatives with detailed solutions. Highly recommended before Quiz 2.",
    fileUrl: "https://drive.google.com/file/d/MAT003/view",
    uploadedBy: "Dr. Myo Min Thein",
    uploadDate: "2025-01-08",
    week: "3",
    tags: "practice, derivatives, quiz-prep, solutions",
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ANN001",
    title: "Campus Closure on January 20th (Public Holiday)",
    content: "Due to Independence Day celebrations, all classes on Monday, January 20th will be cancelled. Wednesday's schedule will be moved to Tuesday, January 21st. Please check the updated calendar.",
    date: "2025-01-08",
    author: "Registrar Office",
    priority: "High",
    category: "General",
    targetCourses: "ALL",
  },
  {
    id: "ANN002",
    title: "CS201 Lab Room Change This Week Only",
    content: "Tuesday's Data Structures lab will be held in Lab 5 instead of Lab 3 due to equipment maintenance. All other details remain the same.",
    date: "2025-01-09",
    author: "Prof. Aung Kyaw",
    priority: "Medium",
    category: "Course Update",
    targetCourses: "CS201",
  },
  {
    id: "ANN003",
    title: "Career Fair Registration Now Open",
    content: "AUY Spring Career Fair on February 10th. 15+ companies including Frontiir, Shwe Taung, and Wave Money. Register by January 25th for guaranteed interview slots.",
    date: "2025-01-07",
    author: "Career Services",
    priority: "Low",
    category: "Opportunity",
    targetCourses: "ALL",
  },
];

const MOCK_ATTENDANCE: AttendanceSummary[] = [
  {
    studentId: "AUY2024001",
    courseId: "CS101",
    totalClasses: "24",
    present: "22",
    late: "1",
    absent: "1",
    percentage: "91.7",
    lastUpdated: "2025-01-08",
  },
  {
    studentId: "AUY2024001",
    courseId: "CS201",
    totalClasses: "18",
    present: "16",
    late: "0",
    absent: "2",
    percentage: "88.9",
    lastUpdated: "2025-01-08",
  },
  {
    studentId: "AUY2024001",
    courseId: "MATH150",
    totalClasses: "20",
    present: "19",
    late: "1",
    absent: "0",
    percentage: "95.0",
    lastUpdated: "2025-01-08",
  },
];

const MOCK_NOTIFICATIONS: StudentNotification[] = [
  {
    studentId: "AUY2024001",
    email: "thant.soe@auy.edu.mm",
    announcementId: "ANN001",
    read: "false",
    readAt: "",
  },
  {
    studentId: "AUY2024001",
    email: "thant.soe@auy.edu.mm",
    announcementId: "ANN002",
    read: "true",
    readAt: "2025-01-09T08:30:00Z",
  },
  {
    studentId: "AUY2024001",
    email: "thant.soe@auy.edu.mm",
    announcementId: "ANN003",
    read: "false",
    readAt: "",
  },
];

/** ------------------------------------------------------------
 * Custom Hooks
 * ----------------------------------------------------------*/

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

function usePolling(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

/** ------------------------------------------------------------
 * Utility Functions
 * ----------------------------------------------------------*/

const gradeToPoints = (grade: string): number => {
  const map: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0,
  };
  return map[grade] ?? 0.0;
};

const timeUntil = (dateString: string, timeString: string): { days: number; hours: number; urgent: boolean } => {
  const due = new Date(`${dateString}T${timeString}`);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, urgent: days <= 2 };
};

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

/** ------------------------------------------------------------
 * Main App Component
 * ----------------------------------------------------------*/

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("auy_logged_in", false);
  const [currentUser, setCurrentUser] = useLocalStorage<Student | null>("auy_current_user", null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useLocalStorage<StudentNotification[]>("auy_notifications", MOCK_NOTIFICATIONS);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Filter data for current student
  const studentEnrollments = useMemo(() => 
    currentUser ? MOCK_ENROLLMENTS.filter(e => e.studentId === currentUser.studentId) : [],
    [currentUser]
  );

  const enrolledCourseIds = useMemo(() => 
    studentEnrollments.map(e => e.courseId), [studentEnrollments]
  );

  const studentSchedule = useMemo(() => 
    MOCK_SCHEDULE.filter(s => enrolledCourseIds.includes(s.courseId)),
    [enrolledCourseIds]
  );

  const studentDeadlines = useMemo(() => 
    MOCK_DEADLINES.filter(d => enrolledCourseIds.includes(d.courseId))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [enrolledCourseIds]
  );

  const studentMaterials = useMemo(() => 
    MOCK_MATERIALS.filter(m => enrolledCourseIds.includes(m.courseId)),
    [enrolledCourseIds]
  );

  const studentAttendance = useMemo(() => 
    MOCK_ATTENDANCE.filter(a => a.studentId === currentUser?.studentId),
    [currentUser]
  );

  const studentNotifications = useMemo(() => 
    notifications.filter(n => n.studentId === currentUser?.studentId),
    [notifications, currentUser]
  );

  const relevantAnnouncements = useMemo(() => 
    MOCK_ANNOUNCEMENTS.filter(ann => 
      ann.targetCourses === "ALL" || enrolledCourseIds.includes(ann.targetCourses)
    ),
    [enrolledCourseIds]
  );

  // Stats calculations
  const gpa = useMemo(() => {
    if (studentEnrollments.length === 0) return 0;
    const totalPoints = studentEnrollments.reduce((sum, e) => {
      return sum + (gradeToPoints(e.grade) * parseFloat(e.credits));
    }, 0);
    const totalCredits = studentEnrollments.reduce((sum, e) => sum + parseFloat(e.credits), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [studentEnrollments]);

  const totalCredits = useMemo(() => 
    studentEnrollments.reduce((sum, e) => sum + parseFloat(e.credits), 0),
    [studentEnrollments]
  );

  const avgAttendance = useMemo(() => {
    if (studentAttendance.length === 0) return 0;
    const avg = studentAttendance.reduce((sum, a) => sum + parseFloat(a.percentage), 0) / studentAttendance.length;
    return Math.round(avg);
  }, [studentAttendance]);

  const unreadCount = useMemo(() => 
    studentNotifications.filter(n => n.read === "false").length,
    [studentNotifications]
  );

  const todaySchedule = useMemo(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return studentSchedule.filter(s => s.dayOfWeek === today);
  }, [studentSchedule]);

  // Polling for updates (simulating real-time from Google Sheets)
  usePolling(() => {
    // In production, this would fetch from SheetDB API
    // For demo, we show a toast occasionally
    if (Math.random() > 0.7) {
      toast.success("Schedule updated from Google Sheets", { 
        icon: "🔄",
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }
      });
    }
  }, 30000); // 30 seconds

  const handleLogin = (email: string, password: string) => {
    // In production: fetch from SheetDB Users sheet
    const userMatch = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (userMatch) {
      const student = MOCK_STUDENTS.find(s => s.email === email) || MOCK_STUDENTS[0];
      setCurrentUser(student);
      setIsLoggedIn(true);
      toast.success(`Welcome back, ${student.studentName}!`, {
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }
      });
    } else {
      toast.error("Invalid email or password", {
        style: {
          background: "rgba(255, 20, 20, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 100, 100, 0.3)",
        }
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab("dashboard");
    toast("Signed out successfully", { icon: "👋" });
  };

  const markAsRead = (announcementId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.announcementId === announcementId && n.studentId === currentUser?.studentId
          ? { ...n, read: "true", readAt: new Date().toISOString() }
          : n
      )
    );
  };

  if (!isLoggedIn) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
          * { font-family: 'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
          .glass {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          .glass-dark {
            background: rgba(28, 28, 30, 0.75);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
        `}</style>
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f5f7] p-4">
          {/* Apple-style subtle gradient mesh background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#0071e3]/10 to-[#5ac8fa]/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#af52de]/10 to-[#ff375f]/8 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[380px]"
          >
            <div className="glass rounded-[32px] p-[2px]">
              <div className="rounded-[30px] bg-white/40 p-8 backdrop-blur-xl">
                {/* AUY Logo/Branding */}
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#0071e3] to-[#0a84ff] shadow-[0_8px_24px_rgba(0,113,227,0.25)]">
                    <span className="text-[28px] font-[590] tracking-[-0.5px] text-white">AU</span>
                    <span className="ml-[-2px] text-[13px] font-[510] text-white/90">Y</span>
                  </div>
                  <h1 className="text-[26px] font-[590] tracking-[-0.5px] text-[#1d1d1f]">American University of Yangon</h1>
                  <p className="mt-1 text-[13px] font-[400] tracking-[-0.08px] text-[#86868b]">Student Portal</p>
                </div>

                {/* Login Form */}
                <LoginForm onLogin={handleLogin} />

                {/* Demo Credentials Hint */}
                <div className="mt-6 rounded-[16px] border border-[#d2d2d7]/50 bg-[#f5f5f7]/60 p-3.5 text-center backdrop-blur-sm">
                  <p className="text-[11.5px] font-[500] uppercase tracking-[0.5px] text-[#86868b]">Demo Access</p>
                  <p className="mt-1.5 font-mono text-[12.5px] tracking-[-0.2px] text-[#1d1d1f]">
                    thant.soe@auy.edu.mm<br />
                    <span className="text-[#86868b]">Password:</span> auy2024
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-[11px] tracking-[-0.08px] text-[#86868b]">
              Secured by Google Sheets • SheetDB API
            </p>
          </motion.div>
        </div>
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
        * { font-family: 'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; }
        .glass {
          background: rgba(255, 255, 255, 0.68);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        .glass-subtle {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.28);
        }
        .glass-dark {
          background: rgba(28, 28, 30, 0.82);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.28); }
      `}</style>

      <div className="relative min-h-screen bg-[#f5f5f7]">
        {/* Subtle ambient background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-[10%] top-[8%] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#0071e3]/[0.07] to-[#5ac8fa]/[0.05] blur-[120px]" />
          <div className="absolute bottom-[12%] right-[8%] h-[480px] w-[480px] rounded-full bg-gradient-to-tl from-[#af52de]/[0.06] to-[#ff375f]/[0.04] blur-[120px]" />
        </div>

        {/* Top Navigation Bar - Glassmorphic */}
        <header className="sticky top-0 z-40 border-b border-[#e5e5ea]/50 backdrop-blur-[20px]">
          <div className="glass-subtle">
            <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-5 md:px-6">
              {/* Logo & Title */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#0071e3] to-[#0a84ff] shadow-[0_4px_12px_rgba(0,113,227,0.2)]">
                  <span className="text-[16px] font-[600] tracking-[-0.3px] text-white">AU</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-[17px] font-[590] tracking-[-0.4px] text-[#1d1d1f]">American University of Yangon</h1>
                  <p className="text-[11px] font-[500] -mt-[2px] tracking-[0.2px] text-[#86868b] uppercase">Student Portal</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-1 lg:flex">
                {[
                  { id: "dashboard", label: "Dashboard", icon: FiGrid },
                  { id: "courses", label: "Courses", icon: FiBookOpen },
                  { id: "materials", label: "Materials", icon: FiFileText },
                  { id: "schedule", label: "Schedule", icon: FiCalendar },
                  { id: "announcements", label: "Announcements", icon: FiBell },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group relative flex h-9 items-center gap-[7px] rounded-[12px] px-[14px] text-[14px] font-[510] tracking-[-0.15px] transition-all",
                      activeTab === tab.id
                        ? "bg-[#0071e3] text-white shadow-[0_4px_12px_rgba(0,113,227,0.25)]"
                        : "text-[#1d1d1f] hover:bg-black/[0.04]"
                    )}
                  >
                    <tab.icon className="h-[15px] w-[15px]" />
                    {tab.label}
                    {tab.id === "announcements" && unreadCount > 0 && (
                      <span className="ml-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff3b30] px-[5px] text-[10.5px] font-[600] text-white shadow-[0_2px_6px_rgba(255,59,48,0.3)]">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Right Side - Profile & Menu */}
              <div className="flex items-center gap-2">
                {/* Notifications Bell (Mobile) */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-[12px] text-[#3a3a3c] transition-colors hover:bg-black/[0.04] lg:hidden">
                  <FiBell className="h-[18px] w-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute right-[6px] top-[6px] h-[8px] w-[8px] rounded-full bg-[#ff3b30]" />
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2.5 rounded-[14px] border border-[#e5e5ea]/60 bg-white/60 px-[10px] py-[6px] backdrop-blur-xl transition-all hover:bg-white/80"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#34c759] to-[#30d158] font-[600] text-[13px] tracking-[-0.2px] text-white">
                      {currentUser?.studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="hidden text-left md:block">
                      <p className="text-[13px] font-[560] leading-[1.1] tracking-[-0.2px] text-[#1d1d1f]">{currentUser?.studentName}</p>
                      <p className="text-[10.5px] font-[500] leading-[1.1] tracking-[0.1px] text-[#86868b]">{currentUser?.studentId}</p>
                    </div>
                    <FiChevronDown className={cn("h-[14px] w-[14px] text-[#86868b] transition-transform", showProfileDropdown && "rotate-180")} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-[52px] z-50 w-[320px] overflow-hidden rounded-[20px] border border-[#e5e5ea]/70 bg-white/85 p-0 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-[30px]"
                      >
                        <div className="border-b border-[#e5e5ea]/60 bg-[#f5f5f7]/70 p-5 backdrop-blur-xl">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-gradient-to-br from-[#34c759] to-[#30d158] text-[20px] font-[600] tracking-[-0.4px] text-white shadow-[0_6px_20px_rgba(52,199,89,0.25)]">
                              {currentUser?.studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-[16px] font-[600] tracking-[-0.3px] text-[#1d1d1f]">{currentUser?.studentName}</p>
                              <p className="text-[12px] font-[500] tracking-[-0.1px] text-[#636366]">{currentUser?.email}</p>
                              <div className="mt-[3px] flex items-center gap-2">
                                <span className="rounded-[6px] bg-[#e8f0fe] px-[6px] py-[2px] text-[10px] font-[600] tracking-[0.3px] text-[#0071e3] uppercase">{currentUser?.major}</span>
                                <span className="text-[10.5px] font-[500] text-[#86868b]">{currentUser?.studyMode}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-[2px] p-[6px]">
                          {[
                            { label: "Student ID", value: currentUser?.studentId, mono: true },
                            { label: "Status", value: currentUser?.status },
                            { label: "Softr Record ID", value: currentUser?.softrRecordId, mono: true, small: true },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between rounded-[12px] px-3.5 py-[10px] hover:bg-black/[0.03]">
                              <span className="text-[12px] font-[500] tracking-[0.2px] text-[#86868b] uppercase">{item.label}</span>
                              <span className={cn("text-[12.5px] font-[510] tracking-[-0.1px] text-[#1d1d1f]", item.mono && "font-mono text-[11.5px]", item.small && "text-[10.5px]")}>
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-[#e5e5ea]/60 p-[6px]">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 rounded-[12px] px-3.5 py-[11px] text-[13.5px] font-[510] tracking-[-0.15px] text-[#ff3b30] transition-colors hover:bg-[#ff3b30]/[0.08]"
                          >
                            <FiLogOut className="h-[16px] w-[16px]" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-[12px] text-[#3a3a3c] transition-colors hover:bg-black/[0.04] lg:hidden"
                >
                  <FiMenu className="h-[19px] w-[19px]" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="fixed bottom-0 left-0 right-0 z-40 rounded-t-[28px] border-t border-[#e5e5ea]/60 bg-white/85 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] backdrop-blur-[30px] lg:hidden"
              >
                <div className="mx-auto mb-4 h-[5px] w-12 rounded-full bg-[#d2d2d7]" />
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { id: "dashboard", label: "Home", icon: FiGrid },
                    { id: "courses", label: "Courses", icon: FiBookOpen },
                    { id: "materials", label: "Files", icon: FiFileText },
                    { id: "schedule", label: "Calendar", icon: FiCalendar },
                    { id: "announcements", label: "Inbox", icon: FiBell },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "relative flex flex-col items-center gap-[4px] rounded-[16px] py-[10px] text-[10.5px] font-[560] tracking-[-0.1px] transition-all",
                        activeTab === tab.id ? "bg-[#0071e3]/[0.12] text-[#0071e3]" : "text-[#636366]"
                      )}
                    >
                      <tab.icon className="h-[21px] w-[21px]" />
                      {tab.label}
                      {tab.id === "announcements" && unreadCount > 0 && (
                        <span className="absolute right-[18%] top-[6px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ff3b30] px-[4px] text-[9px] font-[700] text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="relative z-10 mx-auto max-w-[1200px] px-4 py-6 md:px-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Welcome Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-[28px] font-[600] tracking-[-0.8px] text-[#1d1d1f] md:text-[32px]">Good morning, {currentUser?.studentName.split(" ")[0]}</h2>
                      <p className="mt-[2px] text-[15px] font-[400] tracking-[-0.2px] text-[#636366]">Here's what's happening today at AUY</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-[14px] border border-[#e5e5ea]/50 bg-white/60 px-4 py-[9px] text-[13px] font-[500] tracking-[-0.1px] backdrop-blur-xl">
                      <FiCalendar className="h-[16px] w-[16px] text-[#86868b]" />
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </div>
                  </div>

                  {/* Stats Cards Grid */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      { label: "GPA", value: gpa, suffix: "", subtext: "Current semester", icon: FiBarChart2, color: "from-[#0071e3] to-[#0a84ff]" },
                      { label: "Credits", value: totalCredits.toString(), suffix: "", subtext: "Total enrolled", icon: FiBookOpen, color: "from-[#34c759] to-[#30d158]" },
                      { label: "Attendance", value: avgAttendance.toString(), suffix: "%", subtext: "Average across courses", icon: FiCheckCircle, color: "from-[#ff9500] to-[#ff9f0a]" },
                      { label: "Unread", value: unreadCount.toString(), suffix: "", subtext: "Announcements", icon: FiBell, color: "from-[#ff375f] to-[#ff453a]" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative overflow-hidden rounded-[24px] border border-[#e5e5ea]/40 bg-white/70 p-5 backdrop-blur-[20px] transition-all hover:border-[#d2d2d7]/60 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
                      >
                        <div className={cn("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r", stat.color)} />
                        <div className="mb-3 flex items-center justify-between">
                          <div className={cn("flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br", stat.color, "shadow-[0_4px_12px_rgba(0,0,0,0.1)]")}>
                            <stat.icon className="h-[18px] w-[18px] text-white" />
                          </div>
                        </div>
                        <p className="text-[11px] font-[600] uppercase tracking-[0.5px] text-[#86868b]">{stat.label}</p>
                        <p className="mt-[2px] text-[26px] font-[600] tracking-[-0.6px] text-[#1d1d1f]">
                          {stat.value}<span className="text-[18px]">{stat.suffix}</span>
                        </p>
                        <p className="mt-1 text-[11.5px] font-[450] tracking-[-0.05px] text-[#8e8e93]">{stat.subtext}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Main Dashboard Grid */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Today's Schedule */}
                    <div className="lg:col-span-2">
                      <div className="glass rounded-[28px] overflow-hidden">
                        <div className="border-b border-[#e5e5ea]/50 bg-white/40 p-5 backdrop-blur-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#0071e3]/[0.12]">
                                <FiClock className="h-[20px] w-[20px] text-[#0071e3]" />
                              </div>
                              <div>
                                <h3 className="text-[17px] font-[600] tracking-[-0.3px] text-[#1d1d1f]">Today's Schedule</h3>
                                <p className="text-[12px] font-[500] tracking-[-0.05px] text-[#86868b]">{todaySchedule.length} classes</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="max-h-[340px] overflow-y-auto p-[6px]">
                          {todaySchedule.length > 0 ? (
                            <div className="space-y-[3px]">
                              {todaySchedule.map((cls, i) => (
                                <motion.div
                                  key={cls.scheduleId}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.04 }}
                                  className="group relative flex items-center gap-4 rounded-[20px] border border-transparent bg-white/50 p-4 backdrop-blur-md transition-all hover:border-[#d2d2d7]/40 hover:bg-white/70"
                                >
                                  <div className="flex flex-col items-center justify-center rounded-[14px] bg-[#f5f5f7] px-[10px] py-[8px] text-center min-w-[64px]">
                                    <span className="text-[9px] font-[700] uppercase tracking-[0.3px] text-[#86868b]">START</span>
                                    <span className="text-[15px] font-[600] tracking-[-0.3px] text-[#1d1d1f]">{cls.startTime}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-[15px] font-[600] tracking-[-0.25px] text-[#1d1d1f]">{cls.courseId}</p>
                                    <p className="mt-[1px] line-clamp-1 text-[12.5px] font-[450] tracking-[-0.1px] text-[#636366]">{cls.type} • {cls.room}</p>
                                    <p className="mt-[4px] text-[11px] font-[500] text-[#8e8e93]">{cls.instructor}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[12.5px] font-[600] tracking-[-0.15px] text-[#1d1d1f]">{cls.endTime}</p>
                                    <p className="text-[10px] font-[500] uppercase tracking-[0.3px] text-[#c7c7cc]">END</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f5f5f7]">
                                <FiCalendar className="h-[24px] w-[24px] text-[#c7c7cc]" />
                              </div>
                              <p className="text-[14px] font-[500] tracking-[-0.15px] text-[#636366]">No classes scheduled for today</p>
                              <p className="mt-1 text-[12px] font-[450] text-[#8e8e93]">Enjoy your free day!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="glass rounded-[28px] overflow-hidden">
                      <div className="border-b border-[#e5e5ea]/50 bg-white/40 p-5 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#ff375f]/[0.12]">
                            <FiAlertCircle className="h-[20px] w-[20px] text-[#ff375f]" />
                          </div>
                          <div>
                            <h3 className="text-[17px] font-[600] tracking-[-0.3px] text-[#1d1d1f]">Upcoming Deadlines</h3>
                            <p className="text-[12px] font-[500] tracking-[-0.05px] text-[#86868b]">Next 5 days</p>
                          </div>
                        </div>
                      </div>
                      <div className="max-h-[340px] space-y-[6px] overflow-y-auto p-[6px]">
                        {studentDeadlines.slice(0, 5).map((dl, i) => {
                          const time = timeUntil(dl.dueDate, dl.dueTime);
                          return (
                            <motion.div
                              key={dl.deadlineId}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              className={cn(
                                "group relative overflow-hidden rounded-[20px] border p-4 backdrop-blur-md transition-all",
                                time.urgent
                                  ? "border-[#ff3b30]/30 bg-[#ff3b30]/[0.06] hover:bg-[#ff3b30]/[0.09]"
                                  : "border-[#e5e5ea]/50 bg-white/60 hover:bg-white/80"
                              )}
                            >
                              {time.urgent && (
                                <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#ff3b30] to-[#ff453a]" />
                              )}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="mb-[4px] flex items-center gap-2">
                                    <span className={cn(
                                      "rounded-[8px] px-[7px] py-[3px] text-[9.5px] font-[700] uppercase tracking-[0.4px]",
                                      dl.type === "Assignment" && "bg-[#0071e3]/[0.12] text-[#0071e3]",
                                      dl.type === "Project" && "bg-[#af52de]/[0.12] text-[#af52de]",
                                      dl.type === "Quiz" && "bg-[#ff9500]/[0.12] text-[#ff9500]"
                                    )}>
                                      {dl.type}
                                    </span>
                                    <span className="text-[10.5px] font-[600] tracking-[0.1px] text-[#86868b]">{dl.courseId}</span>
                                  </div>
                                  <p className="line-clamp-2 text-[14px] font-[560] leading-[1.3] tracking-[-0.18px] text-[#1d1d1f]">{dl.title}</p>
                                  <p className="mt-[5px] flex items-center gap-1.5 text-[11.5px] font-[500] text-[#8e8e93]">
                                    <FiClock className="h-[11px] w-[11px]" />
                                    Due {new Date(dl.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {dl.dueTime}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className={cn(
                                    "rounded-[10px] px-[9px] py-[5px] text-center text-[11px] font-[700] tracking-[-0.1px]",
                                    time.urgent
                                      ? "bg-[#ff3b30]/20 text-[#ff3b30]"
                                      : "bg-[#f5f5f7] text-[#3a3a3c]"
                                  )}>
                                    {time.days > 0 ? `${time.days}d` : `${time.hours}h`}
                                  </div>
                                  <p className="mt-[4px] text-[10px] font-[600] text-[#c7c7cc]">{dl.weight}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Quick Access - Courses */}
                  <div className="glass rounded-[28px] p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-[18px] font-[600] tracking-[-0.35px] text-[#1d1d1f]">Your Courses</h3>
                      <button 
                        onClick={() => setActiveTab("courses")}
                        className="flex items-center gap-1.5 text-[13px] font-[560] tracking-[-0.15px] text-[#0071e3] transition-opacity hover:opacity-[0.8]"
                      >
                        View all <FiChevronRight className="h-[15px] w-[15px]" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {studentEnrollments.slice(0, 3).map((enroll, i) => (
                        <motion.div
                          key={enroll.enrollmentId}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="group relative overflow-hidden rounded-[22px] border border-[#e5e5ea]/50 bg-gradient-to-br from-white/80 to-white/60 p-5 backdrop-blur-xl transition-all hover:scale-[1.015] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
                        >
                          <div className="absolute right-[-30px] top-[-30px] h-[100px] w-[100px] rounded-full bg-gradient-to-br from-[#0071e3]/[0.08] to-transparent blur-[30px]" />
                          <div className="relative">
                            <div className="mb-3 flex items-start justify-between">
                              <div>
                                <p className="text-[11px] font-[700] uppercase tracking-[0.5px] text-[#0071e3]">{enroll.courseId}</p>
                                <p className="mt-[2px] text-[15px] font-[600] leading-[1.25] tracking-[-0.25px] text-[#1d1d1f]">{enroll.courseName}</p>
                              </div>
                              <span className={cn(
                                "rounded-[10px] px-[8px] py-[4px] text-[11.5px] font-[700] tracking-[-0.1px]",
                                parseFloat(enroll.attendance) >= 90 && "bg-[#34c759]/[0.15] text-[#34c759]",
                                parseFloat(enroll.attendance) >= 80 && parseFloat(enroll.attendance) < 90 && "bg-[#ff9500]/[0.15] text-[#ff9500]",
                                parseFloat(enroll.attendance) < 80 && "bg-[#ff3b30]/[0.15] text-[#ff3b30]"
                              )}>
                                {enroll.attendance}
                              </span>
                            </div>
                            <div className="mb-4 flex items-center gap-3 text-[11.5px] font-[500] text-[#8e8e93]">
                              <span>{enroll.teacherName}</span>
                              <span className="h-[3px] w-[3px] rounded-full bg-[#d2d2d7]" />
                              <span>{enroll.credits} cr</span>
                            </div>
                            <a
                              href={enroll.googleClassroomLink}
                              target="_blank"
                              className="flex items-center justify-center gap-[6px] rounded-[14px] bg-[#1c1c1e]/[0.06] py-[9px] text-[12.5px] font-[600] tracking-[-0.1px] text-[#1d1d1f] backdrop-blur-sm transition-all hover:bg-[#1c1c1e]/[0.09]"
                            >
                              <FiExternalLink className="h-[14px] w-[14px]" />
                              Open Classroom
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === "courses" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-[28px] font-[600] tracking-[-0.8px] text-[#1d1d1f]">My Courses</h2>
                      <p className="mt-1 text-[14px] font-[450] tracking-[-0.15px] text-[#636366]">{studentEnrollments.length} enrolled • {totalCredits} credits</p>
                    </div>
                    <div className="relative w-full sm:w-[320px]">
                      <FiSearch className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8e8e93]" />
                      <input
                        type="text"
                        placeholder="Search courses, instructors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-[44px] w-full rounded-[16px] border border-[#e5e5ea]/70 bg-white/75 pl-[42px] pr-4 text-[14.5px] font-[450] tracking-[-0.15px] text-[#1d1d1f] placeholder-[#8e8e93] backdrop-blur-xl transition-all focus:border-[#0071e3]/50 focus:outline-none focus:ring-[3px] focus:ring-[#0071e3]/[0.15]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {studentEnrollments
                      .filter(e => 
                        searchQuery === "" || 
                        e.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((enroll, i) => {
                        const attendance = studentAttendance.find(a => a.courseId === enroll.courseId);
                        return (
                          <motion.div
                            key={enroll.enrollmentId}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="group relative overflow-hidden rounded-[28px] border border-[#e5e5ea]/40 bg-white/75 backdrop-blur-[24px]"
                          >
                            {/* Course header gradient */}
                            <div className="relative h-[88px] bg-gradient-to-br from-[#0071e3] to-[#5ac8fa]">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.18] to-transparent" />
                              <div className="relative z-10 flex h-full items-end p-5">
                                <div className="flex-1">
                                  <p className="text-[12px] font-[700] uppercase tracking-[0.6px] text-white/90">{enroll.courseId}</p>
                                  <p className="mt-[1px] text-[19px] font-[600] leading-[1.2] tracking-[-0.4px] text-white">{enroll.courseName}</p>
                                </div>
                                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] border border-white/30 bg-white/[0.22] text-[15px] font-[700] tracking-[-0.3px] text-white backdrop-blur-md">
                                  {enroll.grade}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-5 p-5">
                              {/* Stats row */}
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { label: "Credits", value: enroll.credits },
                                  { label: "Attendance", value: enroll.attendance },
                                  { label: "Last Updated", value: new Date(enroll.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
                                ].map((stat, idx) => (
                                  <div key={idx} className="rounded-[16px] border border-[#e5e5ea]/50 bg-[#f5f5f7]/60 p-3.5 text-center backdrop-blur-sm">
                                    <p className="text-[10px] font-[600] uppercase tracking-[0.4px] text-[#86868b]">{stat.label}</p>
                                    <p className="mt-[3px] text-[15px] font-[600] tracking-[-0.25px] text-[#1d1d1f]">{stat.value}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Detailed attendance breakdown if available */}
                              {attendance && (
                                <div className="rounded-[18px] border border-[#e5e5ea]/50 bg-gradient-to-br from-[#f5f5f7]/80 to-[#f5f5f7]/50 p-4 backdrop-blur-sm">
                                  <p className="mb-3 text-[12px] font-[600] uppercase tracking-[0.4px] text-[#636366]">Attendance Details</p>
                                  <div className="mb-3 flex items-center gap-4 text-[11.5px]">
                                    <span className="flex items-center gap-[5px] font-[500] text-[#34c759]">
                                      <FiCheckCircle className="h-[14px] w-[14px]" /> {attendance.present} present
                                    </span>
                                    <span className="flex items-center gap-[5px] font-[500] text-[#ff9500]">
                                      <FiClock className="h-[14px] w-[14px]" /> {attendance.late} late
                                    </span>
                                    <span className="flex items-center gap-[5px] font-[500] text-[#ff3b30]">
                                      <FiX className="h-[14px] w-[14px]" /> {attendance.absent} absent
                                    </span>
                                  </div>
                                  <div className="h-[6px] overflow-hidden rounded-full bg-[#e5e5ea]">
                                    <div 
                                      className="h-full rounded-full bg-gradient-to-r from-[#34c759] to-[#30d158]"
                                      style={{ width: `${attendance.percentage}%` }}
                                    />
                                  </div>
                                  <p className="mt-[6px] text-right text-[10.5px] font-[600] text-[#636366]">{attendance.percentage}% of {attendance.totalClasses} classes</p>
                                </div>
                              )}

                              {/* Action buttons */}
                              <div className="flex gap-2.5">
                                <a
                                  href={enroll.googleClassroomLink}
                                  target="_blank"
                                  className="flex flex-1 items-center justify-center gap-[6px] rounded-[16px] bg-[#0071e3] py-[11px] text-[13.5px] font-[600] tracking-[-0.15px] text-white shadow-[0_6px_20px_rgba(0,113,227,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,113,227,0.3)]"
                                >
                                  <FiExternalLink className="h-[16px] w-[16px]" />
                                  Google Classroom
                                </a>
                                <button className="flex h-[42px] w-[42px] items-center justify-center rounded-[16px] border border-[#e5e5ea]/60 bg-[#f5f5f7]/70 backdrop-blur-sm transition-colors hover:bg-[#e5e5ea]/50">
                                  <FiCopy className="h-[17px] w-[17px] text-[#636366]" />
                                </button>
                              </div>

                              {/* Softr Record ID - small subtle text for completeness */}
                              <p className="pt-2 text-center font-mono text-[9px] text-[#c7c7cc]">Record: {currentUser?.softrRecordId}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Materials Tab */}
              {activeTab === "materials" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[28px] font-[600] tracking-[-0.8px] text-[#1d1d1f]">Course Materials</h2>
                    <p className="mt-1 text-[14px] font-[450] tracking-[-0.15px] text-[#636366]">{studentMaterials.length} files across your enrolled courses</p>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative flex-1 md:min-w-[320px]">
                      <FiSearch className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8e8e93]" />
                      <input
                        type="text"
                        placeholder="Search materials, descriptions, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-[44px] w-full rounded-[16px] border border-[#e5e5ea]/70 bg-white/75 pl-[42px] pr-4 text-[14.5px] font-[450] tracking-[-0.15px] backdrop-blur-xl placeholder-[#8e8e93] focus:border-[#0071e3]/50 focus:outline-none focus:ring-[3px] focus:ring-[#0071e3]/[0.15]"
                      />
                    </div>
                    <select className="h-[44px] rounded-[16px] border border-[#e5e5ea]/70 bg-white/75 px-4 text-[14px] font-[500] tracking-[-0.1px] backdrop-blur-xl focus:border-[#0071e3]/50 focus:outline-none">
                      <option>All Courses</option>
                      {enrolledCourseIds.map(cid => <option key={cid} value={cid}>{cid}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {studentMaterials
                      .filter(m => 
                        searchQuery === "" ||
                        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.tags.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((mat, i) => (
                        <motion.div
                          key={mat.materialId}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#e5e5ea]/50 bg-white/75 backdrop-blur-[24px] transition-all hover:border-[#d2d2d7]/70 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                        >
                          {/* File type header */}
                          <div className={cn(
                            "flex h-[72px] items-center justify-between px-5",
                            mat.type === "PDF" && "bg-gradient-to-br from-[#ff3b30]/[0.12] to-[#ff453a]/[0.08]",
                            mat.type === "Video" && "bg-gradient-to-br from-[#af52de]/[0.12] to-[#bf5af2]/[0.08]",
                            mat.type === "Link" && "bg-gradient-to-br from-[#0071e3]/[0.12] to-[#0a84ff]/[0.08]"
                          )}>
                            <div className="flex items-center gap-3.5">
                              <div className={cn(
                                "flex h-11 w-11 items-center justify-center rounded-[15px] text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                                mat.type === "PDF" && "bg-gradient-to-br from-[#ff3b30] to-[#ff453a]",
                                mat.type === "Video" && "bg-gradient-to-br from-[#af52de] to-[#bf5af2]",
                                mat.type === "Link" && "bg-gradient-to-br from-[#0071e3] to-[#0a84ff]"
                              )}>
                                {mat.type === "PDF" && <FiFileText className="h-[22px] w-[22px]" />}
                                {mat.type === "Video" && <FiPlay className="h-[22px] w-[22px]" />}
                                {mat.type === "Link" && <FiLink className="h-[22px] w-[22px]" />}
                              </div>
                              <div>
                                <p className="text-[11px] font-[700] uppercase tracking-[0.5px] text-[#1d1d1f]/70">{mat.type}</p>
                                <p className="text-[10.5px] font-[600] tracking-[0.2px] text-[#636366]">Week {mat.week}</p>
                              </div>
                            </div>
                            <span className="rounded-[10px] border border-[#e5e5ea]/60 bg-white/60 px-[8px] py-[4px] text-[10.5px] font-[700] tracking-[0.3px] text-[#3a3a3c] backdrop-blur-sm">{mat.courseId}</span>
                          </div>

                          <div className="flex flex-1 flex-col p-5">
                            <h4 className="mb-[6px] line-clamp-2 text-[15.5px] font-[600] leading-[1.3] tracking-[-0.2px] text-[#1d1d1f]">{mat.title}</h4>
                            <p className="mb-4 line-clamp-2 text-[12.5px] font-[450] leading-[1.45] tracking-[-0.05px] text-[#636366]">{mat.description}</p>

                            {/* Tags */}
                            <div className="mb-4 flex flex-wrap gap-[6px]">
                              {mat.tags.split(",").slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="rounded-[8px] bg-[#f5f5f7] px-[8px] py-[4px] text-[10px] font-[600] tracking-[0.2px] text-[#636366]">#{tag.trim()}</span>
                              ))}
                            </div>

                            {/* Footer with metadata */}
                            <div className="mt-auto space-y-3 border-t border-[#e5e5ea]/50 pt-4">
                              <div className="flex items-center justify-between text-[11px] font-[500] text-[#8e8e93]">
                                <span>Uploaded by {mat.uploadedBy}</span>
                                <span>{new Date(mat.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                              </div>
                              <a
                                href={mat.fileUrl}
                                target="_blank"
                                className="flex w-full items-center justify-center gap-[6px] rounded-[15px] bg-[#1c1c1e]/[0.06] py-[10px] text-[13px] font-[600] tracking-[-0.1px] text-[#1d1d1f] backdrop-blur-sm transition-all hover:bg-[#1c1c1e]/[0.09] group-hover:bg-[#0071e3]/[0.12] group-hover:text-[#0071e3]"
                              >
                                {mat.type === "PDF" && <FiDownload className="h-[15px] w-[15px]" />}
                                {mat.type === "Video" && <FiPlay className="h-[15px] w-[15px]" />}
                                {mat.type === "Link" && <FiExternalLink className="h-[15px] w-[15px]" />}
                                Open {mat.type}
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-[28px] font-[600] tracking-[-0.8px] text-[#1d1d1f]">Weekly Schedule</h2>
                    <p className="mt-1 text-[14px] font-[450] tracking-[-0.15px] text-[#636366]">Your classes for Spring 2025 semester</p>
                  </div>

                  {/* Weekly calendar grid */}
                  <div className="glass overflow-hidden rounded-[28px]">
                    <div className="grid grid-cols-7 border-b border-[#e5e5ea]/50 bg-white/50 text-center text-[11px] font-[700] uppercase tracking-[0.6px] text-[#86868b] backdrop-blur-xl">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                        <div key={day} className="border-r border-[#e5e5ea]/40 py-3.5 last:border-r-0">{day}</div>
                      ))}
                    </div>
                    <div className="grid min-h-[420px] grid-cols-7 divide-x divide-[#e5e5ea]/40">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((dayName, dayIndex) => {
                        const dayClasses = studentSchedule.filter(s => s.dayOfWeek === dayName);
                        const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }) === dayName;
                        
                        return (
                          <div key={dayName} className={cn("relative min-h-[420px] p-[6px]", isToday && "bg-[#0071e3]/[0.04]")}>
                            {isToday && (
                              <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#0071e3]" />
                            )}
                            <div className="space-y-[4px]">
                              {dayClasses
                                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                .map((cls, i) => (
                                  <motion.div
                                    key={cls.scheduleId}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (dayIndex * 0.03) + (i * 0.02) }}
                                    className="group relative overflow-hidden rounded-[16px] border border-[#e5e5ea]/60 bg-white/80 p-3 backdrop-blur-md transition-all hover:z-10 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                                    style={{
                                      marginTop: `${Math.max(0, (parseInt(cls.startTime.split(":")[0]) - 8) * 12)}px`
                                    }}
                                  >
                                    <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#0071e3] to-[#5ac8fa]" />
                                    <p className="mb-[2px] text-[10px] font-[700] uppercase tracking-[0.4px] text-[#0071e3]">{cls.courseId}</p>
                                    <p className="mb-[3px] line-clamp-1 text-[12.5px] font-[600] leading-[1.2] tracking-[-0.15px] text-[#1d1d1f]">{cls.type}</p>
                                    <p className="text-[10.5px] font-[500] text-[#8e8e93]">{cls.startTime} – {cls.endTime}</p>
                                    <p className="mt-[4px] line-clamp-1 text-[10px] font-[500] text-[#c7c7cc]">{cls.room}</p>
                                    {/* Show all Schedule fields on hover tooltip */}
                                    <div className="absolute inset-0 z-20 flex flex-col justify-end rounded-[16px] bg-gradient-to-t from-[#1c1c1e]/[0.92] to-transparent p-3 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                                      <p className="text-[10.5px] font-[600] text-white/90">Instructor: {cls.instructor}</p>
                                      <p className="text-[9.5px] font-[500] text-white/70">Recurring: {cls.recurring} • {cls.startDate} to {cls.endDate}</p>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Schedule list view alternative */}
                  <div className="glass rounded-[28px] p-6">
                    <h3 className="mb-4 text-[16px] font-[600] tracking-[-0.3px] text-[#1d1d1f]">All Classes This Week</h3>
                    <div className="space-y-[6px]">
                      {studentSchedule
                        .sort((a, b) => {
                          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                          return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime);
                        })
                        .map((cls, i) => (
                          <div key={cls.scheduleId} className="flex items-center gap-4 rounded-[18px] border border-[#e5e5ea]/50 bg-white/60 p-4 backdrop-blur-md">
                            <div className="flex h-11 w-11 flex-col items-center justify-center rounded-[14px] bg-[#f5f5f7] text-[10px] font-[700] uppercase tracking-[0.3px] text-[#636366]">
                              {cls.dayOfWeek.slice(0, 3)}<br />
                              <span className="text-[11px] font-[800] text-[#1d1d1f]">{cls.startTime}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <p className="text-[14.5px] font-[600] tracking-[-0.2px] text-[#1d1d1f]">{cls.courseId}</p>
                                <span className="text-[11px] font-[600] tracking-[0.2px] text-[#8e8e93]">{cls.type}</span>
                              </div>
                              <p className="mt-[2px] text-[12px] font-[450] tracking-[-0.05px] text-[#636366]">{cls.instructor} • {cls.room}</p>
                            </div>
                            <div className="text-right text-[11.5px] font-[500] text-[#8e8e93]">
                              {cls.endTime}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Announcements Tab */}
              {activeTab === "announcements" && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-[28px] font-[600] tracking-[-0.8px] text-[#1d1d1f]">Announcements</h2>
                      <p className="mt-1 text-[14px] font-[450] tracking-[-0.15px] text-[#636366]">
                        {relevantAnnouncements.length} total • {unreadCount} unread
                      </p>
                    </div>
                  </div>

                  <div className="space-y-[10px]">
                    {relevantAnnouncements
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((ann) => {
                        const isUnread = studentNotifications.find(n => n.announcementId === ann.id)?.read === "false";
                        return (
                          <motion.div
                            key={ann.id}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => markAsRead(ann.id)}
                            className={cn(
                              "group relative cursor-pointer overflow-hidden rounded-[24px] border p-5 backdrop-blur-[24px] transition-all",
                              isUnread
                                ? "border-[#0071e3]/40 bg-[#0071e3]/[0.06] hover:bg-[#0071e3]/[0.09]"
                                : "border-[#e5e5ea]/50 bg-white/70 hover:bg-white/85"
                            )}
                          >
                            {isUnread && (
                              <div className="absolute left-3 top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full bg-[#0071e3] shadow-[0_0_0_4px_rgba(0,113,227,0.15)]" />
                            )}
                            <div className={cn("flex gap-4", isUnread && "pl-6")}>
                              <div className={cn(
                                "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[15px]",
                                ann.priority === "High" && "bg-[#ff3b30]/[0.15] text-[#ff3b30]",
                                ann.priority === "Medium" && "bg-[#ff9500]/[0.15] text-[#ff9500]",
                                ann.priority === "Low" && "bg-[#34c759]/[0.15] text-[#34c759]"
                              )}>
                                {ann.priority === "High" && <FiAlertCircle className="h-[22px] w-[22px]" />}
                                {ann.priority === "Medium" && <FiInfo className="h-[22px] w-[22px]" />}
                                {ann.priority === "Low" && <FiBell className="h-[22px] w-[22px]" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="mb-[6px] flex flex-wrap items-center gap-2">
                                  <h4 className="text-[16px] font-[600] tracking-[-0.25px] text-[#1d1d1f]">{ann.title}</h4>
                                  <span className={cn(
                                    "rounded-[8px] px-[7px] py-[3px] text-[9.5px] font-[700] uppercase tracking-[0.4px]",
                                    ann.category === "General" && "bg-[#e8f0fe] text-[#0071e3]",
                                    ann.category === "Course Update" && "bg-[#f3e8ff] text-[#af52de]",
                                    ann.category === "Opportunity" && "bg-[#e6f4ea] text-[#34c759]"
                                  )}>
                                    {ann.category}
                                  </span>
                                </div>
                                <p className="mb-3 line-clamp-2 text-[13.5px] font-[450] leading-[1.5] tracking-[-0.1px] text-[#3a3a3c]">{ann.content}</p>
                                <div className="flex items-center gap-4 text-[11.5px] font-[500] text-[#8e8e93]">
                                  <span className="flex items-center gap-[5px]">
                                    <FiUser className="h-[12px] w-[12px]" /> {ann.author}
                                  </span>
                                  <span>{new Date(ann.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                  <span className="rounded-[6px] bg-[#f5f5f7] px-[6px] py-[2px] font-mono text-[10px]">{ann.targetCourses}</span>
                                </div>
                              </div>
                            </div>
                            {isUnread && (
                              <div className="absolute bottom-4 right-5 text-[10.5px] font-[600] uppercase tracking-[0.4px] text-[#0071e3] opacity-60">New</div>
                            )}
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Click outside to close dropdowns */}
        {showProfileDropdown && (
          <div className="fixed inset-0 z-30" onClick={() => setShowProfileDropdown(false)} />
        )}
      </div>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </>
  );
}

/** ------------------------------------------------------------
 * LoginForm Component - Glassmorphic Apple-style
 * ----------------------------------------------------------*/

function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="mb-[6px] block text-[12px] font-[600] uppercase tracking-[0.5px] text-[#636366]">University Email</label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8e8e93]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@auy.edu.mm"
              className="h-[52px] w-full rounded-[16px] border border-[#d2d2d7]/70 bg-white/80 pl-[46px] pr-4 text-[15.5px] font-[450] tracking-[-0.2px] text-[#1d1d1f] placeholder-[#aeaeb2] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all focus:border-[#0071e3] focus:outline-none focus:ring-[4px] focus:ring-[#0071e3]/[0.15]"
            />
          </div>
        </div>

        <div>
          <label className="mb-[6px] block text-[12px] font-[600] uppercase tracking-[0.5px] text-[#636366]">Password</label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8e8e93]" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-[52px] w-full rounded-[16px] border border-[#d2d2d7]/70 bg-white/80 pl-[46px] pr-4 text-[15.5px] font-[450] tracking-[-0.2px] text-[#1d1d1f] placeholder-[#aeaeb2] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all focus:border-[#0071e3] focus:outline-none focus:ring-[4px] focus:ring-[#0071e3]/[0.15]"
            />
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className="relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-gradient-to-b from-[#0071e3] to-[#0062c9] text-[16px] font-[600] tracking-[-0.3px] text-white shadow-[0_8px_24px_rgba(0,113,227,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all disabled:opacity-70"
      >
        <span className={cn("transition-opacity", isLoading && "opacity-0")}>Sign In to Portal</span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[20px] w-[20px] animate-spin rounded-full border-[2.5px] border-white/30 border-t-white" />
          </div>
        )}
        {/* Subtle inner highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </motion.button>

      <div className="text-center">
        <a href="#" className="text-[13px] font-[500] tracking-[-0.1px] text-[#0071e3] hover:underline">
          Forgot password? Contact IT Support
        </a>
      </div>
    </form>
  );
}

// Missing FiLock import - adding inline
const FiLock = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
