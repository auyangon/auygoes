import csv from 'csvtojson';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();

function sanitize(email) {
  return email.replace(/\./g, ',,,');
}

async function upload() {
  console.log('📤 Starting upload to Firebase...');

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

  // 2. Build students object
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
      courses: {}  // Store courses directly under the student
    };
  }

  // 3. Add enrollments to students
  const enrollmentsList = await csv().fromFile('enrollments.csv');
  let count = 0;
  for (const e of enrollmentsList) {
    // Find the student by studentId
    let studentKey = null;
    for (const [key, stu] of Object.entries(students)) {
      if (stu.studentId === e.studentId) {
        studentKey = key;
        break;
      }
    }
    if (!studentKey) {
      continue;
    }

    // Add course data to student's courses
    students[studentKey].courses[e.courseId] = {
      courseName: courses[e.courseId]?.name || e.courseId,
      teacherName: courses[e.courseId]?.teacher || '',
      credits: courses[e.courseId]?.credits || 3,
      googleClassroomLink: courses[e.courseId]?.googleClassroomLink || '',
      grade: e.grade || '',
      attendancePercentage: Number(e.attendancePercentage) || 0
    };
    count++;
  }

  // 4. Upload students to Firebase
  await db.ref('students').set(students);
  console.log(`✅ Students and ${count} enrollments uploaded`);

  // 5. Verify sample student data
  const testEmails = ['jbthaw@gmail.com', 'jinochan1991@gmail.com'];
  for (const email of testEmails) {
    const key = sanitize(email);
    const snap = await db.ref(`students/${key}`).once('value');
    if (snap.exists()) {
      const student = snap.val();
      console.log(`✅ ${email} verified - ${Object.keys(student.courses || {}).length} courses`);
    }
  }

  console.log('🎉 Upload complete!');
}

upload().catch(console.error);
