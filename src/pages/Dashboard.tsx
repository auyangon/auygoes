import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { Announcements } from '../components/Announcements';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { courses, loading, error, gpa, totalCredits, attendance, studentName } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get user course IDs for filtering announcements
  const userCourseIds = courses.map(c => c.courseId);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading your data...</p>
          <style>{@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5' 
      }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '10px' }}>
          <h2 style={{ color: '#c33', marginBottom: '10px' }}>Error</h2>
          <p>{error}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#333' }}>
              Welcome, {studentName || user?.email}!
            </h1>
            <p style={{ margin: '5px 0 0', color: '#666' }}>
              Student ID: {studentName ? 'S001' : 'Loading...'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Announcements Column */}
          <div>
            <Announcements 
              userEmail={user?.email} 
              userCourses={userCourseIds}
            />
          </div>

          {/* Stats Column */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px', color: '#666' }}>GPA</h3>
              <p style={{ fontSize: '32px', margin: 0, color: '#333' }}>{gpa.toFixed(2)}</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px', color: '#666' }}>Credits</h3>
              <p style={{ fontSize: '32px', margin: 0, color: '#333' }}>{totalCredits}</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px', color: '#666' }}>Attendance</h3>
              <p style={{ fontSize: '32px', margin: 0, color: '#333' }}>{attendance}%</p>
            </div>
          </div>
        </div>

        {/* Important Dates Section */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 20px', color: '#333' }}>📅 Important Dates</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>Mar 30</div>
              <div style={{ fontWeight: '500' }}>Thingyan Holiday</div>
              <div style={{ fontSize: '12px', color: '#666' }}>University closed</div>
            </div>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>Apr 15</div>
              <div style={{ fontWeight: '500' }}>Final Exam Schedule</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Published</div>
            </div>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>May 1</div>
              <div style={{ fontWeight: '500' }}>Library Hours</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Extended until 10 PM</div>
            </div>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>May 15</div>
              <div style={{ fontWeight: '500' }}>Last Day of Classes</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Spring 2026</div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px', color: '#333' }}>My Courses</h2>
          
          {courses.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No courses found.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Course</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Code</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Credits</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Grade</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Attendance</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Teacher</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Classroom</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '12px' }}>{course.name}</td>
                      <td style={{ padding: '12px' }}>{course.courseId}</td>
                      <td style={{ padding: '12px' }}>{course.credits}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: course.grade?.startsWith('A') ? '#d4edda' :
                                      course.grade?.startsWith('B') ? '#cce5ff' :
                                      '#fff3cd',
                          color: course.grade?.startsWith('A') ? '#155724' :
                                 course.grade?.startsWith('B') ? '#004085' :
                                 '#856404'
                        }}>
                          {course.grade || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{course.attendancePercentage || 0}%</span>
                          <div style={{
                            width: '60px',
                            height: '6px',
                            background: '#e9ecef',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: ${course.attendancePercentage || 0}%,
                              height: '100%',
                              background: course.attendancePercentage && course.attendancePercentage >= 80 ? '#28a745' :
                                         course.attendancePercentage && course.attendancePercentage >= 60 ? '#ffc107' :
                                         '#dc3545'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{course.teacher}</td>
                      <td style={{ padding: '12px' }}>
                        <a 
                          href={course.googleClassroomLink || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            background: '#f0f2f5',
                            color: '#333',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontSize: '12px'
                          }}
                        >
                          📚 Open
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
