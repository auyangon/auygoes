// ============================================================================
// 🔥 REAL-TIME GOOGLE SHEETS TO FIREBASE SYNC
// ============================================================================

const FIREBASE_URL = "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app";
const FIREBASE_SECRET = "MDqKGOlO8yYHiq1DVEnpee8GaIBSAQgR7FIXP1Va";

// ============================================================================
// AUTO-DETECT CHANGES - Runs whenever ANY cell is edited
// ============================================================================
function onEdit(e) {
  // Get the edited sheet and range
  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  const row = range.getRow();
  const col = range.getColumn();
  
  // Small delay to ensure data is written
  Utilities.sleep(500);
  
  try {
    // Determine what was edited and sync appropriately
    switch(sheetName.toLowerCase()) {
      case 'students':
        syncStudent(row);
        break;
      case 'courses':
        syncCourse(row);
        break;
      case 'enrollments':
        syncEnrollment(row);
        break;
      case 'announcements':
        syncAnnouncement(row);
        break;
      case 'attendance':
        syncAttendance(row);
        break;
    }
    
    // Log the change
    logSync(sheetName, 'auto', 'success', `Row ${row} updated`);
    
  } catch (error) {
    logSync(sheetName, 'auto', 'error', error.toString());
  }
}

// ============================================================================
// SYNC INDIVIDUAL STUDENT
// ============================================================================
function syncStudent(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('students');
  if (!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (!rowData[0]) return; // Skip empty rows
  
  const studentId = rowData[0].toString();
  const student = {};
  
  headers.forEach((header, i) => {
    if (header && rowData[i]) {
      student[header] = rowData[i].toString();
    }
  });
  
  const url = `${FIREBASE_URL}/students/${studentId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(student)
  });
}

// ============================================================================
// SYNC INDIVIDUAL COURSE
// ============================================================================
function syncCourse(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('courses');
  if (!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (!rowData[0]) return;
  
  const courseId = rowData[0].toString();
  const course = {};
  
  headers.forEach((header, i) => {
    if (header && rowData[i]) {
      course[header] = rowData[i].toString();
    }
  });
  
  const url = `${FIREBASE_URL}/courses/${courseId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(course)
  });
}

// ============================================================================
// SYNC INDIVIDUAL ENROLLMENT
// ============================================================================
function syncEnrollment(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('enrollments');
  if (!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (!rowData[0]) return;
  
  const enrollmentId = `enroll_${row}`;
  const enrollment = {};
  
  headers.forEach((header, i) => {
    if (header && rowData[i]) {
      enrollment[header] = rowData[i].toString();
    }
  });
  
  const url = `${FIREBASE_URL}/enrollments/${enrollmentId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(enrollment)
  });
}

// ============================================================================
// SYNC INDIVIDUAL ANNOUNCEMENT
// ============================================================================
function syncAnnouncement(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('announcements');
  if (!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (!rowData[1]) return; // Check for title
  
  const announcementId = `ann${row}`;
  const announcement = {
    id: announcementId,
    title: rowData[1]?.toString() || '',
    content: rowData[2]?.toString() || '',
    date: rowData[3]?.toString() || new Date().toISOString().split('T')[0],
    author: rowData[4]?.toString() || 'Admin',
    priority: rowData[5]?.toString() || 'medium',
    category: rowData[6]?.toString() || 'General'
  };
  
  const url = `${FIREBASE_URL}/announcements/${announcementId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(announcement)
  });
}

// ============================================================================
// SYNC INDIVIDUAL ATTENDANCE RECORD
// ============================================================================
function syncAttendance(row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('attendance');
  if (!sheet) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (!rowData[1]) return; // Check for studentId
  
  const attendanceId = `att_${row}`;
  const record = {
    id: attendanceId,
    studentId: rowData[1]?.toString() || '',
    studentEmail: rowData[2]?.toString() || '',
    courseId: rowData[3]?.toString() || '',
    date: rowData[4]?.toString() || '',
    status: rowData[5]?.toString() || 'present',
    notes: rowData[6]?.toString() || ''
  };
  
  const url = `${FIREBASE_URL}/attendance/${attendanceId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(record)
  });
}

// ============================================================================
// FULL SYNC - Sync ALL sheets
// ============================================================================
function fullSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get all data and sync everything
  const sheets = ['students', 'courses', 'enrollments', 'announcements', 'attendance'];
  
  sheets.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const firebaseData = {};
    
    rows.forEach((row, index) => {
      if (!row[0]) return;
      
      const item = {};
      headers.forEach((header, i) => {
        if (header && row[i]) {
          item[header] = row[i].toString();
        }
      });
      
      if (sheetName === 'students') firebaseData[row[0]] = item;
      else if (sheetName === 'courses') firebaseData[row[0]] = item;
      else firebaseData[`${sheetName.slice(0,-1)}_${index+1}`] = item;
    });
    
    const url = `${FIREBASE_URL}/${sheetName}.json?auth=${FIREBASE_SECRET}`;
    UrlFetchApp.fetch(url, {
      method: 'put',
      contentType: 'application/json',
      payload: JSON.stringify(firebaseData)
    });
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
  ui.createMenu('🔥 Firebase Auto-Sync')
    .addItem('🔄 Full Sync (All Sheets)', 'fullSync')
    .addItem('📋 View Sync Log', 'showLog')
    .addSeparator()
    .addItem('⚡ Auto-Sync is ACTIVE', 'showAutoSyncInfo')
    .addToUi();
}

function showLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName('SyncLog');
  if (logSheet) ss.setActiveSheet(logSheet);
  else SpreadsheetApp.getUi().alert('No sync log found');
}

function showAutoSyncInfo() {
  SpreadsheetApp.getUi().alert(
    '✅ AUTO-SYNC IS ACTIVE\n\n' +
    'Any change you make in any sheet will automatically sync to Firebase within 1 second.\n\n' +
    'The student portal will update instantly!'
  );
}
