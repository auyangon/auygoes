function syncAll() {
  const firebaseUrl = "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app";
  const secret = "MDqKGOlO8yYHiq1DVEnpee8GaIBSAQgR7FIXP1Va";
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sync students
  const studentSheet = ss.getSheetByName('students');
  if (studentSheet) {
    const data = studentSheet.getDataRange().getValues();
    const students = {};
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        students[data[i][0]] = {
          studentId: data[i][0]?.toString(),
          studentName: data[i][1]?.toString(),
          email: data[i][2]?.toString(),
          major: data[i][3]?.toString() || 'ISP'
        };
      }
    }
    UrlFetchApp.fetch(`${firebaseUrl}/students.json?auth=${secret}`, {
      method: 'put', contentType: 'application/json',
      payload: JSON.stringify(students)
    });
  }
  
  // Sync announcements
  const annSheet = ss.getSheetByName('announcements');
  if (annSheet) {
    const data = annSheet.getDataRange().getValues();
    const announcements = {};
    for (let i = 1; i < data.length; i++) {
      if (data[i][1]) {
        announcements[`ann${i}`] = {
          title: data[i][1]?.toString(),
          content: data[i][2]?.toString(),
          date: data[i][3]?.toString(),
          author: data[i][4]?.toString() || 'Admin'
        };
      }
    }
    UrlFetchApp.fetch(`${firebaseUrl}/announcements.json?auth=${secret}`, {
      method: 'put', contentType: 'application/json',
      payload: JSON.stringify(announcements)
    });
  }
  
  SpreadsheetApp.getUi().alert('✅ Sync Complete!');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🔥 Firebase')
    .addItem('Sync Now', 'syncAll')
    .addToUi();
}
