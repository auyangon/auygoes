const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();
const students = {};

function encodeEmail(email) {
  return email.replace(/\./g, ',,,').replace(/@/g, ',,@,,');
}

fs.createReadStream('enrollments.csv')
  .pipe(csv())
  .on('data', (row) => {
    const email = row.email;
    if (!email) return;
    if (!students[email]) {
      students[email] = {
        studentId: row.studentId,
        studentName: row.studentName,
        email: email,
        studyMode: row.studyMode,
        major: row.major,
        courses: {}
      };
    }
    const courseId = row.courseId;
    if (courseId) {
      students[email].courses[courseId] = {
        courseName: row.courseName,
        teacherName: row.teacherName,
        credits: parseInt(row.credits) || 0,
        grade: row.grade,
        attendancePercentage: parseInt(row.attendancePercentage) || 0,
        googleClassroomLink: row.googleClassroomLink
      };
    }
  })
  .on('end', async () => {
    console.log(`Found ${Object.keys(students).length} unique students. Uploading...`);
    const updates = {};
    for (const [email, studentData] of Object.entries(students)) {
      updates[`students/${encodeEmail(email)}`] = studentData;
    }
    try {
      await db.ref().update(updates);
      console.log('✅ Student data uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error);
    } finally {
      process.exit();
    }
  });