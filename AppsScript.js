// ============================================
// GOOGLE APPS SCRIPT – STUDENT PORTAL BACKEND
// EMAIL AS PRIMARY KEY
// ============================================

const CONFIG = {
  SHEET_NAME: 'portal_data',
  STUDENTS_SHEET: 'students',
  COURSES_SHEET: 'courses',
  ENROLLMENTS_SHEET: 'enrollments'
};

// Add custom menu when sheet opens
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 Student Portal')
    .addItem('📥 Load Student Data', 'loadStudentData')
    .addItem('📊 Show Student Stats', 'showStudentStats')
    .addItem('🔍 Find Student by Email', 'findStudentByEmail')
    .addSeparator()
    .addItem('📚 Generate Attendance Sheets', 'generateAttendanceSheets')
    .addItem('❓ Help', 'showHelp')
    .addToUi();
}

// ============================================
// 1. LOAD ALL STUDENT DATA
// ============================================
function loadStudentData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create or clear main sheet
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  } else {
    sheet.clear();
  }
  
  // Load CSV data from script properties (or you can paste directly)
  const studentsCsv = `email,studentId,studentName,major,studyMode
aung.khant.phyo@student.au.edu.mm,S001,Aung Khant Phyo,ISP program,OnCampus
hsu.eain.htet@student.au.edu.mm,S002,Hsu Eain Htet,ISP program,OnCampus
jinochan1991@gmail.com,S055,Jino Chan,ISP program,OnCampus
hninyamoneoo.au.edu@gmail.com,S056,Hnin Yamone Oo,ISP program,OnCampus`;

  const enrollmentsCsv = `email,courseId,grade,attendancePercentage
aung.khant.phyo@student.au.edu.mm,BUS101,B,86
aung.khant.phyo@student.au.edu.mm,ENG101,B-,95
jinochan1991@gmail.com,BUS101,A-,95
jinochan1991@gmail.com,ENG101,B+,88
hninyamoneoo.au.edu@gmail.com,BUS101,B,79
hninyamoneoo.au.edu@gmail.com,ENG101,B-,85`;

  // Parse CSV
  const students = parseCSV(studentsCsv);
  const enrollments = parseCSV(enrollmentsCsv);
  
  // Create headers
  const headers = ['email', 'studentId', 'studentName', 'major', 'studyMode', 'courseId', 'courseName', 'grade', 'attendancePercentage'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0B4F3A').setFontColor('white');
  
  // Build data rows (one row per enrollment)
  const rows = [];
  enrollments.forEach(enroll => {
    const student = students.find(s => s.email === enroll.email);
    if (student) {
      rows.push([
        student.email,
        student.studentId,
        student.studentName,
        student.major,
        student.studyMode,
        enroll.courseId,
        getCourseName(enroll.courseId),
        enroll.grade,
        enroll.attendancePercentage
      ]);
    }
  });
  
  // Write data
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  // Highlight email column
  sheet.getRange(2, 1, sheet.getMaxRows(), 1).setBackground('#E8F5E9');
  
  SpreadsheetApp.getUi().alert(`✅ Loaded ${rows.length} enrollment records!\n\nEmail is the primary key.`);
}

// ============================================
// 2. FIND STUDENT BY EMAIL
// ============================================
function findStudentByEmail() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('🔍 Find Student', 'Enter student email:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const email = response.getResponseText().trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    ui.alert('Please load student data first');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  const results = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toLowerCase() === email) {
      results.push(data[i]);
    }
  }
  
  if (results.length === 0) {
    ui.alert('❌ No student found with email: ' + email);
    return;
  }
  
  let message = `📧 ${email}\n`;
  message += `🎓 Student ID: ${results[0][1]}\n`;
  message += `👤 Name: ${results[0][2]}\n`;
  message += `📚 Enrolled Courses: ${results.length}\n\n`;
  message += `📝 Grades:\n`;
  
  results.forEach(row => {
    message += `  • ${row[5]}: ${row[7] || '-'} (${row[8] || '?'}% attendance)\n`;
  });
  
  ui.alert('Student Details', message, ui.ButtonSet.OK);
}

// ============================================
// 3. SHOW STUDENT STATISTICS
// ============================================
function showStudentStats() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Please load student data first');
    return;
  }
  
  const data = sheet.getDataRange().getValues();
  const students = new Set();
  const courses = new Set();
  const grades = {};
  
  for (let i = 1; i < data.length; i++) {
    students.add(data[i][0]); // email
    courses.add(data[i][5]); // courseId
    
    const grade = data[i][7];
    if (grade) {
      grades[grade] = (grades[grade] || 0) + 1;
    }
  }
  
  let message = '📊 PORTAL STATISTICS\n\n';
  message += `👥 Total Students: ${students.size}\n`;
  message += `📚 Total Courses: ${courses.size}\n`;
  message += `📁 Total Records: ${data.length - 1}\n\n`;
  message += `🎓 Grade Distribution:\n`;
  
  const sortedGrades = Object.entries(grades).sort();
  sortedGrades.forEach(([grade, count]) => {
    const percentage = ((count / (data.length - 1)) * 100).toFixed(1);
    message += `  ${grade}: ${count} (${percentage}%)\n`;
  });
  
  SpreadsheetApp.getUi().alert(message);
}

// ============================================
// 4. GENERATE ATTENDANCE SHEETS
// ============================================
function generateAttendanceSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const courses = ['BUS101', 'ENG101', 'HUM11', 'IT101', 'MATH101', 'STAT100'];
  
  courses.forEach(courseId => {
    const sheetName = `ATT_${courseId}`;
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      sheet.clear();
    }
    
    // Get students enrolled in this course
    const mainSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (mainSheet) {
      const data = mainSheet.getDataRange().getValues();
      const students = new Set();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][5] === courseId) {
          students.add(data[i][2]); // student name
        }
      }
      
      const studentList = Array.from(students).sort();
      
      // Setup attendance sheet
      sheet.getRange(1, 1).setValue('Student Name');
      sheet.getRange(1, 2).setValue('Add dates here →');
      sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#0B4F3A').setFontColor('white');
      
      if (studentList.length > 0) {
        sheet.getRange(2, 1, studentList.length, 1).setValues(studentList.map(n => [n]));
      }
      
      sheet.autoResizeColumn(1);
    }
  });
  
  SpreadsheetApp.getUi().alert('✅ Attendance sheets created for all courses!');
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    result.push(row);
  }
  return result;
}

function getCourseName(courseId) {
  const courses = {
    'BUS101': 'Introduction to Business',
    'ENG101': 'English Composition',
    'HUM11': 'Humanities',
    'IT101': 'Computer Fundamentals',
    'MATH101': 'College Mathematics',
    'STAT100': 'Statistics'
  };
  return courses[courseId] || courseId;
}

function showHelp() {
  const help = `
🎓 STUDENT PORTAL – GOOGLE SHEETS BACKEND

📧 EMAIL IS PRIMARY KEY
  • Every record is linked by email
  • Same email = same student
  • Use email to find students

📋 SHEET STRUCTURE:
  Column A: email (PRIMARY KEY)
  Column B: studentId
  Column C: studentName
  Column D: major
  Column E: studyMode
  Column F: courseId
  Column G: courseName
  Column H: grade
  Column I: attendancePercentage

🔄 MENU OPTIONS:
  • Load Student Data – Creates main sheet from CSV
  • Show Student Stats – View statistics
  • Find Student by Email – Search for a student
  • Generate Attendance Sheets – Creates ATT_* sheets

📝 NOTES:
  • Email column is highlighted in light green
  • One row per course enrollment
  • Use the attendance sheets for daily tracking
  `;
  
  SpreadsheetApp.getUi().alert(help);
}
