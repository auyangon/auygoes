import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function verifyData() {
  console.log('🔍 Verifying student data in Firebase...\n');

  const testEmails = [
    'hninyamoneoo.au.edu@gmail.com',
    'jbthaw@gmail.com',
    'jinochan1991@gmail.com',
    'aung.khant.phyo@student.au.edu.mm'
  ];

  for (const email of testEmails) {
    const key = sanitize(email);
    const snap = await db.ref(`students/${key}`).once('value');
    
    if (snap.exists()) {
      const student = snap.val();
      console.log(`✅ ${email}`);
      console.log(`   Name: ${student.name || student.studentName}`);
      console.log(`   Student ID: ${student.studentId}`);
      console.log(`   Courses: ${Object.keys(student.courses || {}).length}`);
      
      // Show first few courses
      const courses = Object.entries(student.courses || {}).slice(0, 3);
      if (courses.length > 0) {
        console.log(`   Sample grades: ${courses.map(([id, c]) => `${id}: ${c.grade}`).join(', ')}`);
      }
      console.log('');
    } else {
      console.log(`❌ ${email} - NOT FOUND\n`);
    }
  }

  console.log('✨ Verification complete!');
}

verifyData().catch(console.error);
