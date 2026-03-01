import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { Card } from '../components/Common';

export const DebugDatabase: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get all students
      const studentsRef = ref(db, '/students');
      const snapshot = await get(studentsRef);
      
      if (snapshot.exists()) {
        setStudents(snapshot.val());
      }

      // Get current user data if logged in
      if (user?.email) {
        const userRef = ref(db, `students/${user.email}`);
        const userSnap = await get(userRef);
        if (userSnap.exists()) {
          setCurrentUserData(userSnap.val());
        } else {
          // Try with sanitized
          const sanitized = user.email.replace(/\./g, ',,,');
          const altRef = ref(db, `students/${sanitized}`);
          const altSnap = await get(altRef);
          if (altSnap.exists()) {
            setCurrentUserData({ ...altSnap.val(), _note: 'Used sanitized key' });
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchStudent = async () => {
    if (!searchEmail) return;
    
    try {
      // Try exact email
      const exactRef = ref(db, `students/${searchEmail}`);
      const exactSnap = await get(exactRef);
      
      if (exactSnap.exists()) {
        setSearchResult({ method: 'exact email', data: exactSnap.val() });
        return;
      }
      
      // Try sanitized
      const sanitized = searchEmail.replace(/\./g, ',,,');
      const sanitizedRef = ref(db, `students/${sanitized}`);
      const sanitizedSnap = await get(sanitizedRef);
      
      if (sanitizedSnap.exists()) {
        setSearchResult({ method: 'sanitized email', data: sanitizedSnap.val() });
        return;
      }
      
      // Search in all students
      const allRef = ref(db, '/students');
      const allSnap = await get(allRef);
      
      if (allSnap.exists()) {
        const all = allSnap.val();
        const foundKey = Object.keys(all).find(key => 
          key.includes(searchEmail.split('@')[0])
        );
        
        if (foundKey) {
          setSearchResult({ 
            method: 'partial match', 
            key: foundKey,
            data: all[foundKey] 
          });
        } else {
          setSearchResult({ method: 'not found', data: null });
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading database...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#0B4F3A]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Database Debugger</h1>
      
      {/* Current User Info */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Current User</h2>
        <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
        {currentUserData ? (
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(currentUserData, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No data found for current user</p>
        )}
      </Card>

      {/* Search */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Search Student</h2>
        <div className="flex gap-2">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter email"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={searchStudent}
            className="px-4 py-2 bg-[#0B4F3A] text-white rounded"
          >
            Search
          </button>
        </div>
        {searchResult && (
          <div className="mt-2">
            <p><strong>Method:</strong> {searchResult.method}</p>
            {searchResult.key && <p><strong>Key:</strong> {searchResult.key}</p>}
            {searchResult.data && (
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {JSON.stringify(searchResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </Card>

      {/* All Students */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>All Students ({students ? Object.keys(students).length : 0})</h2>
        {students && (
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Email Key</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">ID</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(students).map(([key, value]: [string, any]) => (
                  <tr key={key} className="border-b">
                    <td className="p-2 font-mono text-xs">{key}</td>
                    <td className="p-2">{value.studentName || value.name || '-'}</td>
                    <td className="p-2">{value.studentId || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
