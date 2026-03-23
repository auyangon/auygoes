export const CONFIG = {
  API_BASE_URL: 'https://script.google.com/macros/s/AKfycbyfmemkEGxuQiDwTEGQzS6IsyzUEl1PtO-zX4_Ml9hYi5Hn0OcCBm7U5iyIed37XHTI/exec',
  REFRESH_INTERVAL: 60000,
  DEMO_STUDENT_EMAIL: 'offiaung8@gmail.com',
  APP_NAME: 'AUY Student Portal',
  APP_VERSION: '1.0.0',
  UNIVERSITY_NAME: 'American University of Yangon',
};

export const SHEET_NAMES = {
  Students: 'Students',
  Courses: 'Courses',
  Enrollments: 'Enrollments',
  Schedule: 'Schedule',
  Materials: 'Materials',
  Announcements: 'Announcements',
  Attendance: 'Attendance',
  Quests: 'Quests',
  StudentQuests: 'StudentQuests',
  Requests: 'Requests',
};

export type SheetName = keyof typeof SHEET_NAMES;
