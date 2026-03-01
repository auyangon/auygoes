// ============================================================================
// 🔥 ATTENDANCE SYNC - Using Email as Reference
// ============================================================================

const FIREBASE_URL = "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app";
const FIREBASE_SECRET = "MDqKGOlO8yYHiq1DVEnpee8GaIBSAQgR7FIXP1Va";

// Encode email for Firebase (replace dots with commas)
function encodeEmail(email) {
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
  
  if (row === 1) return; // Skip header
  
  try {
    if (sheetName.toLowerCase() === 'attendance') {
      syncAttendanceRow(sheet, row);
    }
    
    logSync(sheetName, 'auto', 'success', `Row ${row} updated`);
  } catch (error) {
    logSync(sheetName, 'auto', 'error', error.toString());
  }
}

// ============================================================================
// SYNC ATTENDANCE ROW
// ============================================================================
function syncAttendanceRow(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  if (!rowData[2]) return; // Need studentEmail
  
  const attendanceId = `att_${rowData[0] || row}`;
  const record = {
    id: attendanceId,
    studentEmail: rowData[2]?.toString() || '', // Email column
    studentName: rowData[3]?.toString() || '',
    courseId: rowData[4]?.toString() || '',
    courseName: rowData[5]?.toString() || '',
    date: rowData[6]?.toString() || '',
    status: rowData[7]?.toString() || 'present',
    notes: rowData[8]?.toString() || '',
    lastUpdated: new Date().toISOString()
  };
  
  // Upload to Firebase - using email as reference in the record
  const url = `${FIREBASE_URL}/attendance/${attendanceId}.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(record)
  });
  
  // Also update student's attendance summary
  updateStudentSummary(record.studentEmail, record.courseId);
}

// ============================================================================
// UPDATE STUDENT ATTENDANCE SUMMARY
// ============================================================================
function updateStudentSummary(studentEmail, courseId) {
  const encodedEmail = encodeEmail(studentEmail);
  
  // Get all attendance for this student
  const url = `${FIREBASE_URL}/attendance.json?auth=${FIREBASE_SECRET}`;
  const response = UrlFetchApp.fetch(url);
  const attendanceData = JSON.parse(response.getContentText());
  
  let present = 0, late = 0, absent = 0, total = 0;
  
  Object.values(attendanceData || {}).forEach(record => {
    if (record.studentEmail === studentEmail && record.courseId === courseId) {
      total++;
      switch(record.status) {
        case 'present': present++; break;
        case 'late': late++; break;
        case 'absent': absent++; break;
      }
    }
  });
  
  const percentage = total ? Math.round(((present + late) / total) * 100) : 0;
  
  // Update student's course attendance
  const summaryUrl = `${FIREBASE_URL}/students/${encodedEmail}/courses/${courseId}/attendance.json?auth=${FIREBASE_SECRET}`;
  UrlFetchApp.fetch(summaryUrl, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify({
      present, late, absent, total, percentage,
      lastUpdated: new Date().toISOString()
    })
  });
}

// ============================================================================
// FULL SYNC
// ============================================================================
function fullSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('attendance');
  
  if (!sheet) return;
  
  const lastRow = sheet.getLastRow();
  for (let row = 2; row <= lastRow; row++) {
    syncAttendanceRow(sheet, row);
  }
  
  SpreadsheetApp.getUi().alert('✅ Attendance Sync Complete!');
}

// ============================================================================
// LOG SYNC
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
  ui.createMenu('🔥 Attendance Sync')
    .addItem('🔄 Sync All Attendance', 'fullSync')
    .addItem('📋 View Sync Log', 'viewLog')
    .addToUi();
}

function viewLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName('SyncLog');
  if (logSheet) ss.setActiveSheet(logSheet);
}
