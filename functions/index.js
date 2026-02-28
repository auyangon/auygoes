const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const axios = require('axios');

admin.initializeApp();

// ============================================
// CONFIGURATION – UPDATE THESE VALUES
// ============================================
const SPREADSHEET_ID = '1t48__wu9xla5mXZgoGnrIdxwVYC-_rM1nUqoBaiuem8'; // Your sheet ID
const SHEET_NAME = 'portal_data'; // Your sheet name

// Grade point mapping
const gradePoints = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
};

// ============================================
// 1. INITIAL SYNC: Firebase → portal_data
// ============================================
exports.initialSyncToSheets = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  try {
    console.log('📤 Starting initial sync to portal_data...');
    
    // Get all students from Firebase
    const snapshot = await admin.database().ref('students').once('value');
    const students = snapshot.val();
    
    if (!students) {
      return res.status(200).json({ success: true, count: 0, message: 'No students found' });
    }
    
    // Prepare rows for sheets
    const rows = [['studentId', 'studentName', 'email', 'major', 'studyMode', 'courseId', 'courseName', 'teacherName', 'credits', 'grade', 'attendancePercentage', 'lastUpdated']];
    
    for (const [emailKey, student] of Object.entries(students)) {
      const courses = student.courses || {};
      
      for (const [courseId, course] of Object.entries(courses)) {
        rows.push([
          student.studentId || '',
          student.name || '',
          student.email || '',
          student.major || '',
          student.studyMode || '',
          courseId,
          course.courseName || '',
          course.teacherName || '',
          course.credits || 3,
          course.grade || '',
          course.attendancePercentage || 0,
          new Date().toISOString().split('T')[0]
        ]);
      }
    }
    
    // Return the data for the Apps Script to write
    res.status(200).json({ 
      success: true, 
      count: rows.length - 1,
      data: rows,
      headers: rows[0]
    });
    
  } catch (error) {
    console.error('❌ Initial sync failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 2. SHEETS → FIREBASE SYNC
// ============================================
exports.syncSheetsToFirebase = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  
  try {
    const { rowData, action } = req.body;
    
    const [studentId, studentName, email, major, studyMode, courseId, courseName, teacherName, credits, grade, attendance] = rowData;
    
    console.log(`📥 Processing ${action} for ${email} - ${courseId}`);
    
    // Find student by email
    const snapshot = await admin.database()
      .ref('students')
      .orderByChild('email')
      .equalTo(email)
      .once('value');
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    const updates = {};
    snapshot.forEach(child => {
      const studentKey = child.key;
      
      if (action === 'UPDATE_GRADE' || action === 'BULK_UPDATE') {
        updates[`students/${studentKey}/courses/${courseId}/grade`] = grade;
      }
      
      if (action === 'UPDATE_ATTENDANCE' || action === 'BULK_UPDATE') {
        updates[`students/${studentKey}/courses/${courseId}/attendancePercentage`] = parseInt(attendance) || 0;
      }
      
      // Also update course details if needed
      updates[`students/${studentKey}/courses/${courseId}/courseName`] = courseName;
      updates[`students/${studentKey}/courses/${courseId}/teacherName`] = teacherName;
      updates[`students/${studentKey}/courses/${courseId}/credits`] = parseInt(credits) || 3;
    });
    
    await admin.database().ref().update(updates);
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Sheets sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 3. GET STUDENT LIST (for Apps Script)
// ============================================
exports.getStudentList = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  try {
    const snapshot = await admin.database().ref('students').once('value');
    const students = snapshot.val();
    
    const studentList = [];
    for (const [key, student] of Object.entries(students)) {
      studentList.push({
        email: student.email,
        name: student.name,
        studentId: student.studentId,
        courseCount: Object.keys(student.courses || {}).length
      });
    }
    
    res.status(200).json(studentList);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
