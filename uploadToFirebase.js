const csv = require('csvtojson');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();

function sanitize(email) {
  return email.replace(/\./g, ',,,');
}

async function upload() {
  // 1. Upload courses
  const courses = {};
  const coursesList = await csv().fromFile('courses.csv');
  for (const row of coursesList) {
    courses[row.courseId] = {
      name: row.courseName,
      teacher: row.teacherName,
      credits: Number(row.credits),
      googleClassroomLink: row.googleClassroomLink
    };
  }
  await db.ref('courses').set(courses);
  console.log('✅ Courses uploaded');

  // 2. Upload students with enrollments
  const students = {};
  const studentsList = await csv().fromFile('students.csv');
  for (const s of studentsList) {
    const emailKey = sanitize(s.email);
    students[emailKey] = {
      studentId: s.studentId,
      name: s.studentName,
      email: s.email,
      major: s.major,
      studyMode: s.studyMode,
      enrollments: {}
    };
  }

  const enrollmentsList = await csv().fromFile('enrollments.csv');
  for (const e of enrollmentsList) {
    let studentKey = null;
    for (const [key, stu] of Object.entries(students)) {
      if (stu.studentId === e.studentId) {
        studentKey = key;
        break;
      }
    }
    if (!studentKey) continue;

    students[studentKey].enrollments[e.courseId] = {
      grade: e.grade,
      attendancePercentage: Number(e.attendancePercentage),
      lastUpdated: e.lastUpdated,
      courseData: courses[e.courseId] || {}
    };
  }

  await db.ref('students').set(students);
  console.log('✅ Students & enrollments uploaded');

  // 3. Upload announcements (optional)
  try {
    const annList = await csv().fromFile('announcements.csv');
    const announcements = {};
    for (const a of annList) {
      announcements[a.announcementId] = {
        title: a.title,
        content: a.content,
        date: a.date,
        target: a.targetAudience
      };
    }
    await db.ref('announcements').set(announcements);
    console.log('✅ Announcements uploaded');
  } catch (e) {
    console.log('ℹ️ No announcements file or error, skipping.');
  }

  console.log('🎉 All done!');
}

upload().catch(console.error);
