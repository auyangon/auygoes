// ============================================
// Google Sheets Data Service
// Use this in your React app to fetch data from published sheets
// ============================================

// First, publish your Google Sheet:
// File → Share → Publish to web → Choose CSV → Copy URL

const SHEET_URLS = {
  // Replace these with your published CSV URLs
  students: 'YOUR_PUBLISHED_STUDENTS_CSV_URL',
  enrollments: 'YOUR_PUBLISHED_ENROLLMENTS_CSV_URL',
  courses: 'YOUR_PUBLISHED_COURSES_CSV_URL'
};

export async function fetchStudentData(email) {
  try {
    // Fetch enrollments
    const enrollmentsResponse = await fetch(SHEET_URLS.enrollments);
    const enrollmentsText = await enrollmentsResponse.text();
    const enrollments = parseCSV(enrollmentsText);
    
    // Filter by email
    const studentEnrollments = enrollments.filter(e => e.email === email);
    
    if (studentEnrollments.length === 0) {
      return { error: 'No student found with this email' };
    }
    
    // Fetch student details
    const studentsResponse = await fetch(SHEET_URLS.students);
    const studentsText = await studentsResponse.text();
    const students = parseCSV(studentsText);
    const student = students.find(s => s.email === email);
    
    // Fetch courses
    const coursesResponse = await fetch(SHEET_URLS.courses);
    const coursesText = await coursesResponse.text();
    const courses = parseCSV(coursesText);
    
    // Build student object
    const studentData = {
      email: student.email,
      studentId: student.studentId,
      studentName: student.studentName,
      major: student.major,
      studyMode: student.studyMode,
      courses: studentEnrollments.map(enroll => {
        const course = courses.find(c => c.courseId === enroll.courseId);
        return {
          courseId: enroll.courseId,
          courseName: course?.courseName || enroll.courseId,
          teacherName: course?.teacherName || '',
          credits: course?.credits || 3,
          grade: enroll.grade,
          attendancePercentage: enroll.attendancePercentage
        };
      })
    };
    
    return studentData;
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: error.message };
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    result.push(row);
  }
  return result;
}

// Example usage in your component:
/*
import { fetchStudentData } from './services/sheetService';

const StudentDashboard = ({ userEmail }) => {
  const [studentData, setStudentData] = useState(null);
  
  useEffect(() => {
    fetchStudentData(userEmail).then(data => {
      if (!data.error) {
        setStudentData(data);
      }
    });
  }, [userEmail]);
  
  return (
    <div>
      <h1>Welcome, {studentData?.studentName}</h1>
      <div>GPA: {calculateGPA(studentData?.courses)}</div>
      {studentData?.courses.map(course => (
        <div key={course.courseId}>
          {course.courseName}: {course.grade}
        </div>
      ))}
    </div>
  );
};
*/
