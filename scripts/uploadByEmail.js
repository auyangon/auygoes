const csv = require('csvtojson');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();

function sanitize(email) {
  return email.replace(/\./g, ',,,');
}

async function upload() {
  const enrollments = await csv().fromFile('portal_data - portal_data.csv');

  const students = {};

  for (const row of enrollments) {
    const emailKey = sanitize(row.email);
    if (!students[emailKey]) {
      students[emailKey] = {
        studentId: row.studentId,
        name: row.studentName,
        email: row.email,
        major: row.major,
        studyMode: row.studyMode,
        enrollments: {}
      };
    }

    students[emailKey].enrollments[row.courseId] = {
      grade: row.grade,
      attendancePercentage: Number(row.attendancePercentage),
      lastUpdated: row.lastUpdated,
      courseData: {
        name: row.courseName,
        teacher: row.teacherName,
        credits: Number(row.credits),
        googleClassroomLink: row.googleClassroomLink
      }
    };
  }

  await db.ref('students').set(students);
  console.log('✅ Students data uploaded');

  // Optional: also upload courses reference
  const courses = {};
  for (const row of enrollments) {
    if (!courses[row.courseId]) {
      courses[row.courseId] = {
        name: row.courseName,
        teacher: row.teacherName,
        credits: Number(row.credits),
        googleClassroomLink: row.googleClassroomLink
      };
    }
  }
  await db.ref('courses').set(courses);
  console.log('✅ Courses data uploaded');
}

upload().catch(console.error);
