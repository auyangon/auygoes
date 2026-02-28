import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/Common';

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

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B4F3A 0%, #1a4f8b 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255,255,255,0.3)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading your data...</p>
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
        background: 'linear-gradient(135deg, #0B4F3A 0%, #1a4f8b 100%)'
      }}>
        <Card className="p-8 max-w-md text-center">
          <h2 style={{ color: '#c33', marginBottom: '10px' }}>Error</h2>
          <p>{error}</p>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #0B4F3A 0%, #1a4f8b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go Back to Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Card className="p-6" style={{ borderLeft: '4px solid #1a4f8b' }}>
          <h3 style={{ margin: '0 0 10px', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>GPA</h3>
          <p style={{ fontSize: '32px', margin: 0, color: '#1a4f8b', fontWeight: 'bold' }}>{gpa.toFixed(2)}</p>
        </Card>
        
        <Card className="p-6" style={{ borderLeft: '4px solid #0B4F3A' }}>
          <h3 style={{ margin: '0 0 10px', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Credits</h3>
          <p style={{ fontSize: '32px', margin: 0, color: '#0B4F3A', fontWeight: 'bold' }}>{totalCredits}</p>
        </Card>
        
        <Card className="p-6" style={{ borderLeft: '4px solid #1a4f8b' }}>
          <h3 style={{ margin: '0 0 10px', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Attendance</h3>
          <p style={{ fontSize: '32px', margin: 0, color: '#1a4f8b', fontWeight: 'bold' }}>{attendance}%</p>
        </Card>
      </div>

      {/* Two Column Layout for Announcements and Important Dates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Announcements Card */}
        <Card 
          className="p-6 cursor-pointer" 
          onClick={() => navigate('/announcements')}
          style={{ transition: 'all 0.3s' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, color: '#1a4f8b', fontSize: '18px' }}>📢 Latest Announcements</h2>
            <span style={{ color: '#1a4f8b', fontSize: '14px' }}>View All →</span>
          </div>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1a4f8b' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#1a4f8b' }}>🏫 Thingyan Holiday</div>
              <div style={{ fontSize: '14px', color: '#666' }}>University closed March 30 - April 4</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Posted by: Admin • 2 days ago</div>
            </div>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #0B4F3A' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#0B4F3A' }}>📝 Final Exam Schedule</div>
              <div style={{ fontSize: '14px', color: '#666' }}>The final examination schedule for May 2026 has been published.</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>Posted by: Academic Office • 5 days ago</div>
            </div>
          </div>
        </Card>

        {/* Important Dates Card */}
        <Card className="p-6">
          <h2 style={{ margin: '0 0 15px', color: '#1a4f8b', fontSize: '18px' }}>📅 Important Dates</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ background: '#1a4f8b', color: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', minWidth: '50px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>30</div>
                <div style={{ fontSize: '10px' }}>MAR</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Thingyan Holiday</div>
                <div style={{ fontSize: '12px', color: '#666' }}>University closed</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ background: '#0B4F3A', color: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', minWidth: '50px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>15</div>
                <div style={{ fontSize: '10px' }}>APR</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Final Exam Schedule</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Published</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ background: '#1a4f8b', color: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', minWidth: '50px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>1</div>
                <div style={{ fontSize: '10px' }}>MAY</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Library Hours Extended</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Open until 10 PM</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="p-6">
        <h2 style={{ margin: '0 0 20px', color: '#1a4f8b', fontSize: '18px' }}>My Courses</h2>
        
        {courses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No courses found.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#1a4f8b' }}>Course</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#1a4f8b' }}>Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#1a4f8b' }}>Credits</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#1a4f8b' }}>Grade</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#1a4f8b' }}>Attendance</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#1a4f8b' }}>Teacher</th>
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
                            width: `${course.attendancePercentage || 0}%`,
                            height: '100%',
                            background: course.attendancePercentage && course.attendancePercentage >= 80 ? '#28a745' :
                                       course.attendancePercentage && course.attendancePercentage >= 60 ? '#ffc107' :
                                       '#dc3545'
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>{course.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </MainLayout>
  );
}
