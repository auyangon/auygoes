function encodeEmail(email) {
  return email.replace(/\./g, ',');
}

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
      case 'enrollments':
        syncEnrollment(sheet, row);
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

function syncStudent(sheet, row) {
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const email = rowData[2];
  if (!email) return;
  
  const encodedEmail = encodeEmail(email);
  
  const student = {
    studentName: rowData[1],
    email: email,
    major: rowData[3] || 'ISP',
    studyMode: rowData[4] || 'OnCampus',
    status: rowData[5] || 'Active'
  };
  
  const url = `https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app/students/${encodedEmail}.json?auth=MDqKGOlO8yYHiq1DVEnpee8GaIBSAQgR7FIXP1Va`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(student)
  });
}

function syncEnrollment(sheet, row) {
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  const email = rowData[3];
  const courseId = rowData[6];
  if (!email || !courseId) return;
  
  const encodedEmail = encodeEmail(email);
  
  const enrollment = {
    courseId: courseId,
    courseName: rowData[7],
    teacherName: rowData[8],
    credits: rowData[9],
    grade: rowData[10],
    attendancePercentage: rowData[12] || 0
  };
  
  const url = `https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app/students/${encodedEmail}/courses/${courseId}.json?auth=MDqKGOlO8yYHiq1DVEnpee8GaIBSAQgR7FIXP1Va`;
  UrlFetchApp.fetch(url, {
    method: 'put',
    contentType: 'application/json',
    payload: JSON.stringify(enrollment)
  });
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔥 Firebase Sync')
    .addItem('Manual Sync', 'manualSync')
    .addToUi();
}

function manualSync() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('enrollments');
  const lastRow = sheet.getLastRow();
  
  for (let row = 2; row <= lastRow; row++) {
    syncEnrollment(sheet, row);
  }
  
  SpreadsheetApp.getUi().alert('Sync Complete!');
}
