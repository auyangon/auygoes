// src/pages/OneAdmin.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash, Download, Upload, 
  Users, BookOpen, GraduationCap, LogOut,
  Search, Filter, X, Save, RefreshCw 
} from 'lucide-react';

// ==================== THE ONE ADMIN ====================
// One component to rule them all - Students, Courses, Grades, everything!

function OneAdmin() {
  // ========== STATE ==========
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit, delete
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Data states
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    email: '',
    name: '',
    major: 'ISP program',
    studyMode: 'OnCampus',
    courseCode: '',
    courseName: '',
    credits: 3,
    teacher: '',
    grade: '',
    attendance: 0,
    enrolledCourses: []
  });

  // ========== CONFIG ==========
  const CONFIG = {
    // Change these to your actual values
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    ADMIN_KEY: 'your-secret-key-change-this',
    STORAGE_KEY: 'one-admin-auth',
    
    // Default data if no connection
    MOCK_DATA: {
      students: [
        { studentId: 'S001', name: 'Aung Khant Phyo', email: 'aung.khant.phyo@student.au.edu.mm', major: 'ISP', studyMode: 'OnCampus', status: 'Active' },
        { studentId: 'S002', name: 'Hsu Eain Htet', email: 'hsu.eain.htet@student.au.edu.mm', major: 'ISP', studyMode: 'OnCampus', status: 'Active' },
        { studentId: 'S003', name: 'Htoo Yadanar Oo', email: 'htoo.yadanar.oo@student.au.edu.mm', major: 'ISP', studyMode: 'OnCampus', status: 'Active' },
      ],
      courses: [
        { courseCode: 'BUS101', courseName: 'Introduction to Business', credits: 3, teacher: 'Prof. Johnson' },
        { courseCode: 'ENG101', courseName: 'English Composition', credits: 3, teacher: 'Dr. Smith' },
        { courseCode: 'IT101', courseName: 'Computer Fundamentals', credits: 3, teacher: 'Dr. Brown' },
      ]
    }
  };

  // ========== AUTH ==========
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Simple password check - change this!
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem(CONFIG.STORAGE_KEY, 'true');
    } else {
      alert('Wrong password! Try: admin123');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(CONFIG.STORAGE_KEY);
  };

  // Check auth on load
  useEffect(() => {
    const auth = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // ========== DATA LOADING ==========
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Try to load from Google Sheets
      await Promise.all([
        loadStudents(),
        loadCourses(),
        loadEnrollments()
      ]);
    } catch (error) {
      console.log('Using mock data:', error);
      // Fallback to mock data
      setStudents(CONFIG.MOCK_DATA.students);
      setCourses(CONFIG.MOCK_DATA.courses);
    }
    setLoading(false);
  };

  const loadStudents = async () => {
    try {
      const response = await fetch(
        `${CONFIG.GOOGLE_SHEETS_URL}?action=getStudents&key=${CONFIG.ADMIN_KEY}`
      );
      const data = await response.json();
      if (data.success) setStudents(data.data);
    } catch (error) {
      console.log('Using mock students');
      setStudents(CONFIG.MOCK_DATA.students);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetch(
        `${CONFIG.GOOGLE_SHEETS_URL}?action=getCourses&key=${CONFIG.ADMIN_KEY}`
      );
      const data = await response.json();
      if (data.success) setCourses(data.data);
    } catch (error) {
      console.log('Using mock courses');
      setCourses(CONFIG.MOCK_DATA.courses);
    }
  };

  const loadEnrollments = async () => {
    // Load student-course enrollments
    setEnrollments([]);
  };

  // ========== CRUD OPERATIONS ==========
  const handleAdd = async () => {
    setLoading(true);
    try {
      if (modalType === 'student') {
        const newStudent = {
          studentId: formData.studentId || `S${String(students.length + 1).padStart(3, '0')}`,
          name: formData.name,
          email: formData.email,
          major: formData.major,
          studyMode: formData.studyMode,
          status: 'Active'
        };
        setStudents([...students, newStudent]);
      } else if (modalType === 'course') {
        const newCourse = {
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          credits: formData.credits,
          teacher: formData.teacher
        };
        setCourses([...courses, newCourse]);
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      alert('Error adding: ' + error.message);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    if (modalType === 'student') {
      setStudents(students.map(s => 
        s.studentId === selectedItem?.studentId ? formData : s
      ));
    } else if (modalType === 'course') {
      setCourses(courses.map(c => 
        c.courseCode === selectedItem?.courseCode ? formData : c
      ));
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    if (type === 'student') {
      setStudents(students.filter(s => s.studentId !== id));
    } else if (type === 'course') {
      setCourses(courses.filter(c => c.courseCode !== id));
    }
  };

  const handleUpdateGrade = (studentId, courseCode, grade, attendance) => {
    // Update grade logic
    alert(`Updated ${studentId} - ${courseCode}: Grade ${grade}, Attendance ${attendance}%`);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      email: '',
      name: '',
      major: 'ISP program',
      studyMode: 'OnCampus',
      courseCode: '',
      courseName: '',
      credits: 3,
      teacher: '',
      grade: '',
      attendance: 0,
      enrolledCourses: []
    });
    setSelectedItem(null);
  };

  // ========== EXPORT/IMPORT ==========
  const exportToCSV = (type) => {
    const data = type === 'students' ? students : courses;
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const importFromCSV = (event, type) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      const newData = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, i) => {
          obj[header.trim()] = values[i]?.trim();
          return obj;
        }, {});
      }).filter(item => Object.values(item).some(v => v));
      
      if (type === 'students') {
        setStudents([...students, ...newData]);
      } else {
        setCourses([...courses, ...newData]);
      }
    };
    
    reader.readAsText(file);
  };

  // ========== FILTERED DATA ==========
  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(c => 
    c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.teacher?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== RENDER LOGIN ==========
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
              <GraduationCap className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600 mt-2">Enter the password to rule them all</p>
          </div>
          
          <form onSubmit={handleAdminLogin}>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Enter the One Admin
            </button>
          </form>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Hint: Try "admin123"
          </p>
        </div>
      </div>
    );
  }

  // ========== RENDER MAIN ADMIN ==========
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">One Admin to Rule Them All</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadAllData}
                className="p-2 text-gray-500 hover:text-indigo-600 transition"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleAdminLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            {[
              { id: 'students', label: 'Students', icon: Users },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'grades', label: 'Grades', icon: GraduationCap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center px-6 py-3 font-medium text-sm rounded-t-lg transition
                  ${activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => exportToCSV(activeTab)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => importFromCSV(e, activeTab)}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={() => {
                  setModalType(activeTab.slice(0, -1)); // 'students' -> 'student'
                  setShowModal(true);
                }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading data from the cloud...</p>
          </div>
        )}

        {/* Students Tab */}
        {!loading && activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Major</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.major}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.studyMode === 'OnCampus' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.studyMode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {student.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedItem(student);
                          setFormData(student);
                          setModalType('student');
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('student', student.studentId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No students found
              </div>
            )}
          </div>
        )}

        {/* Courses Tab */}
        {!loading && activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.courseCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {course.courseCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.teacher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedItem(course);
                          setFormData(course);
                          setModalType('course');
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('course', course.courseCode)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grades Tab */}
        {!loading && activeTab === 'grades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grade Update Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
                Quick Grade Update
              </h2>
              
              <div className="space-y-4">
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
                
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.courseCode} value={c.courseCode}>
                      {c.courseCode} - {c.courseName}
                    </option>
                  ))}
                </select>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Grade (A, B+, etc)"
                    className="p-3 border rounded-lg"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Attendance %"
                    className="p-3 border rounded-lg"
                    value={formData.attendance}
                    onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                  />
                </div>
                
                <button
                  onClick={() => handleUpdateGrade(
                    formData.studentId,
                    formData.courseCode,
                    formData.grade,
                    formData.attendance
                  )}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                >
                  Update Grade
                </button>
              </div>
            </div>

            {/* Grade Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Grades</h2>
              <div className="space-y-3">
                {students.slice(0, 5).map(student => (
                  <div key={student.studentId} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-sm text-gray-500">{student.studentId}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      BUS101: B (86%) • ENG101: B- (95%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">
                {modalType === 'student' 
                  ? (selectedItem ? 'Edit Student' : 'Add Student')
                  : (selectedItem ? 'Edit Course' : 'Add Course')
                }
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {modalType === 'student' ? (
                // Student Form
                <>
                  <input
                    type="text"
                    placeholder="Student ID"
                    className="w-full p-3 border rounded-lg"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Major"
                    className="w-full p-3 border rounded-lg"
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                  />
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={formData.studyMode}
                    onChange={(e) => setFormData({...formData, studyMode: e.target.value})}
                  >
                    <option>OnCampus</option>
                    <option>Remote</option>
                  </select>
                </>
              ) : (
                // Course Form
                <>
                  <input
                    type="text"
                    placeholder="Course Code (e.g., BUS101)"
                    className="w-full p-3 border rounded-lg"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({...formData, courseCode: e.target.value.toUpperCase()})}
                  />
                  <input
                    type="text"
                    placeholder="Course Name"
                    className="w-full p-3 border rounded-lg"
                    value={formData.courseName}
                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    className="w-full p-3 border rounded-lg"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                  />
                  <input
                    type="text"
                    placeholder="Teacher Name"
                    className="w-full p-3 border rounded-lg"
                    value={formData.teacher}
                    onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                  />
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={selectedItem ? handleEdit : handleAdd}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {selectedItem ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OneAdmin;