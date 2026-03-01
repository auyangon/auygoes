// ============================================================================
// 🔥 GOOGLE SHEETS TO FIREBASE SYNC - WITH EMAIL ENCODING (FIXED)
// ============================================================================

const FIREBASE_URL = "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app";
const FIREBASE_SECRET = "MDqKGOlO8yYHiq1DVEnpee8GaIBSAQgR7FIXP1Va";

// ============================================================================
// ENCODE EMAIL FOR FIREBASE PATH (replace dots with commas)
// ============================================================================
function encodeEmail(email) {
  if (!email) return '';
  return email.replace(/\./g, ',');
}

// ============================================================================
// AUTO-SYNC ON EDIT
// ============================================================================
function onEdit(e) {
  Utilities.sleep(500);
  
  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  const row = range.getRow();
  
  if (row === 1) return;
  
  try {
    switch(sheetName.toLowerCase()) {
      case 'students':
        syncStudent(sheet, row);
        break;
      case 'courses':
        syncCourse(sheet, row);
        break;
      case 'enrollments':
        syncEnrollment(sheet, row);
        break;
      case 'announcements':
        syncAnnouncement(sheet, row);
        break;
    }
    logSync(sheetName, 'auto', 'success', `Row ${row} updated`);
  } catch (error) {
    logSync(sheetName, 'auto', 'error', error.toString());
  }
}

// ============================================================================
// SYNC STUDENT DATA - USING ENCODED EMAIL AS KEY
// ============================================================================
function syncStudent(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const email = rowData[2]?.toString().trim();
  if (!email) return;
  
  const encodedEmail = encodeEmail(email);
  
  const student = {
    studentId: rowData[0]?.toString().trim() || '',
    studentName: rowData[1]?.toString().trim() || '',
    email: email,                     // store original email
    major: rowData[3]?.toString().trim() || 'ISP',
    studyMode: rowData[4]?.toString().trim() || 'OnCampus',
    status: rowData[5]?.toString().trim() || 'Active',
    lastUpdated: new Date().toISOString()
  };
  
  // USE ENCODED EMAIL AS KEY!
  const url = `${FIREBASE_URL}/students/${encodedEmail}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(student),
    muteHttpExceptions: true
  });
  
  Logger.log(`✅ Synced student: ${email} → ${encodedEmail}`);
}

// ============================================================================
// SYNC ENROLLMENT DATA (Courses per student) - USING ENCODED EMAIL
// ============================================================================
function syncEnrollment(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const email = rowData[3]?.toString().trim(); // studentEmail column
  const courseId = rowData[6]?.toString().trim(); // courseId column
  
  if (!email || !courseId) return;
  
  const encodedEmail = encodeEmail(email);
  
  // First, get the student's current data (using encoded key)
  const studentUrl = `${FIREBASE_URL}/students/${encodedEmail}.json?auth=${FIREBASE_SECRET}`;
  const studentResponse = UrlFetchApp.fetch(studentUrl);
  const student = JSON.parse(studentResponse.getContentText() || '{}');
  
  if (!student.courses) student.courses = {};
  
  student.courses[courseId] = {
    courseId: courseId,
    courseName: rowData[7]?.toString().trim() || '',
    teacherName: rowData[8]?.toString().trim() || '',
    credits: parseInt(rowData[9]) || 3,
    grade: rowData[10]?.toString().trim() || '',
    attendancePercentage: parseInt(rowData[12]) || 0,
    lastUpdated: new Date().toISOString()
  };
  
  const updateUrl = `${FIREBASE_URL}/students/${encodedEmail}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(updateUrl, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(student),
    muteHttpExceptions: true
  });
  
  Logger.log(`✅ Synced enrollment for ${email} → ${encodedEmail} - ${courseId}`);
}

// ============================================================================
// SYNC COURSE DATA (Master course list) - unchanged
// ============================================================================
function syncCourse(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const courseId = rowData[0]?.toString().trim();
  if (!courseId) return;
  
  const course = {
    courseId: courseId,
    courseName: rowData[1]?.toString().trim() || '',
    credits: parseInt(rowData[2]) || 3,
    teacher: rowData[3]?.toString().trim() || '',
    googleClassroomLink: rowData[4]?.toString().trim() || '',
    lastUpdated: new Date().toISOString()
  };
  
  const url = `${FIREBASE_URL}/courses/${courseId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(course),
    muteHttpExceptions: true
  });
  
  Logger.log(`✅ Synced course: ${courseId}`);
}

// ============================================================================
// SYNC ANNOUNCEMENT - unchanged
// ============================================================================
function syncAnnouncement(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const announcementId = `ann${row}`;
  const announcement = {
    id: announcementId,
    title: rowData[1]?.toString().trim() || '',
    content: rowData[2]?.toString().trim() || '',
    date: rowData[3]?.toString().trim() || new Date().toISOString().split('T')[0],
    author: rowData[4]?.toString().trim() || 'Admin',
    priority: rowData[5]?.toString().trim() || 'medium',
    category: rowData[6]?.toString().trim() || 'General',
    lastUpdated: new Date().toISOString()
  };
  
  const url = `${FIREBASE_URL}/announcements/${announcementId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(announcement),
    muteHttpExceptions: true
  });
  
  Logger.log(`✅ Synced announcement: ${announcement.title}`);
}

// ============================================================================
// FULL SYNC - Sync ALL sheets (now uses encoded emails)
// ============================================================================
function fullSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['students', 'courses', 'enrollments', 'announcements'];
  
  sheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    const lastRow = sheet.getLastRow();
    for (let row = 2; row <= lastRow; row++) {
      try {
        switch(sheetName) {
          case 'students':
            syncStudent(sheet, row);
            break;
          case 'courses':
            syncCourse(sheet, row);
            break;
          case 'enrollments':
            syncEnrollment(sheet, row);
            break;
          case 'announcements':
            syncAnnouncement(sheet, row);
            break;
        }
      } catch (e) {
        Logger.log(`Error syncing ${sheetName} row ${row}: ${e}`);
      }
    }
  });
  
  SpreadsheetApp.getUi().alert('✅ Full Sync Complete!');
}

// ============================================================================
// LOG SYNC OPERATIONS
// ============================================================================
function logSync(sheet, trigger, status, details) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName('SyncLog');
  
  if (!logSheet) {
    logSheet = ss.insertSheet('SyncLog');
    logSheet.appendRow(['Timestamp', 'Sheet', 'Trigger', 'Status', 'Details']);
  }
  
  logSheet.appendRow([new Date().toISOString(), sheet, trigger, status, details]);
}

// ============================================================================
// CUSTOM MENU
// ============================================================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔥 Firebase Sync')
    .addItem('🔄 Full Sync All Sheets', 'fullSync')
    .addItem('📋 View Sync Log', 'viewLog')
    .addSeparator()
    .addItem('✅ Auto-Sync is ACTIVE', 'showStatus')
    .addToUi();
}

function viewLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName('SyncLog');
  if (logSheet) ss.setActiveSheet(logSheet);
}

function showStatus() {
  SpreadsheetApp.getUi().alert(
    '✅ AUTO-SYNC ACTIVE\n\n' +
    'Any change in Students, Courses, Enrollments, or Announcements sheets\n' +
    'will automatically sync to Firebase within 1 second!\n\n' +
    'Student portal updates instantly.'
  );
}
