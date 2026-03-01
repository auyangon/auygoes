import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { Card } from '../components/Common';

export const DebugFirebase: React.FC = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<any>(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      
      const email = user.email;
      const encodedEmail = email.replace(/\./g, ',');
      
      console.log('🔍 Debug - Email:', email);
      console.log('🔍 Debug - Encoded:', encodedEmail);
      
      try {
        // Try to get specific student
        const studentRef = ref(db, `students/${encodedEmail}`);
        const studentSnap = await get(studentRef);
        
        if (studentSnap.exists()) {
          setStudentData(studentSnap.val());
          console.log('✅ Found student:', studentSnap.val());
        } else {
          console.log('❌ No student at:', `students/${encodedEmail}`);
        }
        
        // Get all students to see structure
        const allRef = ref(db, 'students');
        const allSnap = await get(allRef);
        
        if (allSnap.exists()) {
          setAllStudents(allSnap.val());
          console.log('📋 All students keys:', Object.keys(allSnap.val()));
        }
        
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <div className="p-6">Please login first</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#0B4F3A]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Firebase Debug</h1>
      
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Current User</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Encoded:</strong> {user.email.replace(/\./g, ',')}</p>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-2">Your Student Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : studentData ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(studentData, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No student data found for your email</p>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-2">All Students in Firebase</h2>
        {allStudents ? (
          <div>
            <p><strong>Keys found:</strong> {Object.keys(allStudents).length}</p>
            <div className="mt-2">
              {Object.keys(allStudents).map(key => (
                <div key={key} className="p-2 bg-gray-50 mb-1 rounded">
                  <code>{key}</code>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No students found in Firebase</p>
        )}
      </Card>
    </div>
  );
};

