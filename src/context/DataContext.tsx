import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePolling } from '../hooks/usePolling';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  grade: string;
  gradePoints: number;
  progress: number;
  color: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
}

export interface Material {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: 'PDF' | 'Video' | 'Slides' | 'Assignment' | 'Link';
  size: string;
  uploadedAt: string;
  instructor: string;
  url: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
  type: 'Lecture' | 'Lab' | 'Tutorial' | 'Exam';
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  department: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: 'Academic' | 'Campus' | 'Events' | 'Exam' | 'Financial';
  isRead: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface CourseAttendance {
  courseId: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  color: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  records: AttendanceRecord[];
}

interface DataContextType {
  courses: Course[];
  materials: Material[];
  schedule: ScheduleItem[];
  announcements: Announcement[];
  attendance: CourseAttendance[];
  isLoading: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
  markAnnouncementRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function makeAttendanceRecords(
  total: number,
  presentCount: number,
  lateCount: number
): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const base = new Date('2024-01-15');
  let p = 0, l = 0;
  for (let i = 0; i < total; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i * 2);
    let status: 'present' | 'absent' | 'late';
    if (l < lateCount && i % 7 === 5) { status = 'late'; l++; }
    else if (p < presentCount) { status = 'present'; p++; }
    else status = 'absent';
    records.push({ date: d.toISOString().split('T')[0], status });
  }
  return records;
}

// Helper to map API data to internal types
function mapCourse(apiCourse: any, enrollment: any, index: number): Course {
  const colors = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
  const color = colors[index % colors.length];
  const gradePointsMap: Record<string, number> = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
  };
  const gradePoints = gradePointsMap[enrollment?.grade] || 0;
  return {
    id: apiCourse.courseId,
    code: apiCourse.courseCode,
    name: apiCourse.courseName,
    instructor: apiCourse.instructor,
    credits: apiCourse.credits,
    grade: enrollment?.grade || '',
    gradePoints,
    progress: enrollment ? Math.floor(Math.random() * 30 + 70) : 0, // placeholder
    color,
    schedule: apiCourse.schedule,
    room: apiCourse.room,
    enrolled: 0,
    capacity: 0,
  };
}

function mapMaterial(apiMaterial: any, courseName: string): Material {
  return {
    id: apiMaterial.materialId,
    courseId: apiMaterial.courseId,
    courseName,
    title: apiMaterial.title,
    type: apiMaterial.type,
    size: apiMaterial.fileSize || '—',
    uploadedAt: apiMaterial.uploadDate,
    instructor: apiMaterial.uploadedBy,
    url: apiMaterial.fileLink,
  };
}

function mapSchedule(apiSchedule: any, courseName: string, color: string): ScheduleItem {
  return {
    id: apiSchedule.scheduleId,
    courseId: apiSchedule.courseId,
    courseName,
    instructor: apiSchedule.instructor,
    day: apiSchedule.dayOfWeek,
    startTime: apiSchedule.startTime,
    endTime: apiSchedule.endTime,
    room: apiSchedule.room,
    color,
    type: apiSchedule.type,
  };
}

function mapAnnouncement(apiAnnouncement: any): Announcement {
  return {
    id: apiAnnouncement.announcementId,
    title: apiAnnouncement.title,
    body: apiAnnouncement.content,
    author: apiAnnouncement.author,
    department: apiAnnouncement.category,
    date: apiAnnouncement.publishDate,
    priority: apiAnnouncement.priority.toLowerCase(),
    category: apiAnnouncement.category,
    isRead: false, // will be set by notifications
  };
}

function mapAttendance(course: Course, attendanceData: any[]): CourseAttendance | null {
  const summary = attendanceData.find(a => a.courseId === course.id);
  if (!summary) return null;
  const total = summary.totalClasses || 0;
  const present = summary.present || 0;
  const late = summary.late || 0;
  const absent = summary.absent || 0;
  const percentage = Math.round((present / total) * 100);
  const records = makeAttendanceRecords(total, present, late);
  return {
    courseId: course.id,
    courseCode: course.code,
    courseName: course.name,
    instructor: course.instructor,
    color: course.color,
    totalClasses: total,
    present,
    absent,
    late,
    percentage,
    records,
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendance, setAttendance] = useState<CourseAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Fetch student's enrollments
      const enrollments = await api.getStudentEnrollments(user.id);
      const courseIds = enrollments.map(e => e.courseId);
      // Fetch all courses
      const allCourses = await api.getCourses();
      // Filter courses that this student is enrolled in
      const studentCourses = allCourses.filter(c => courseIds.includes(c.courseId));
      // For each, find enrollment details
      const mappedCourses = studentCourses.map((c, i) => {
        const enrollment = enrollments.find(e => e.courseId === c.courseId);
        return mapCourse(c, enrollment, i);
      });
      setCourses(mappedCourses);

      // Fetch materials for these courses
      const allMaterials = await api.getMaterials();
      const courseMaterials = allMaterials.filter(m => courseIds.includes(m.courseId));
      const mappedMaterials = courseMaterials.map(m => mapMaterial(m, mappedCourses.find(c => c.id === m.courseId)?.name || ''));
      setMaterials(mappedMaterials);

      // Fetch schedule
      const allSchedule = await api.getSchedule();
      const courseSchedule = allSchedule.filter(s => courseIds.includes(s.courseId));
      const mappedSchedule = courseSchedule.map(s => mapSchedule(s, mappedCourses.find(c => c.id === s.courseId)?.name || '', mappedCourses.find(c => c.id === s.courseId)?.color || '#8b5cf6'));
      setSchedule(mappedSchedule);

      // Fetch announcements
      const allAnnouncements = await api.getAnnouncements();
      const filteredAnnouncements = allAnnouncements.filter(a => a.targetAudience === 'ALL' || courseIds.includes(a.targetAudience));
      const mappedAnnouncements = filteredAnnouncements.map(mapAnnouncement);
      // Apply read status from notifications
      const notifications = await api.getNotificationsForStudent(user.id);
      const readMap = new Map(notifications.map(n => [n.announcementId, n.isRead]));
      const announcementsWithRead = mappedAnnouncements.map(a => ({
        ...a,
        isRead: readMap.get(a.id) || readIds.has(a.id) || false,
      }));
      setAnnouncements(announcementsWithRead);

      // Fetch attendance summaries
      const attendanceSummaries = await api.getStudentAttendance(user.id);
      const mappedAttendance = mappedCourses
        .map(c => mapAttendance(c, attendanceSummaries))
        .filter(a => a !== null);
      setAttendance(mappedAttendance);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, readIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  usePolling(fetchData, 60000, !!user);

  const markAnnouncementRead = useCallback((id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  }, []);

  return (
    <DataContext.Provider value={{
      courses,
      materials,
      schedule,
      announcements,
      attendance,
      isLoading,
      lastUpdated,
      refetch: fetchData,
      markAnnouncementRead,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
