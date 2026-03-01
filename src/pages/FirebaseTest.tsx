// src/pages/FirebaseTest.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/Common';

export const FirebaseTest: React.FC = () => {
  const [students, setStudents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const studentsRef = ref(db, 'students');
      const snapshot = await get(studentsRef);
      if (snapshot.exists()) {
        setStudents(snapshot.val());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-[#0B4F3A] mb-4">Firebase Data</h1>
      
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Student Keys in Firebase</h2>
        {loading ? (
          <p>Loading...</p>
        ) : students ? (
          <div>
            <p className="mb-2">Found {Object.keys(students).length} students</p>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {Object.keys(students).map(key => (
                <div key={key} className="mb-3 p-3 bg-white rounded shadow-sm">
                  <div className="font-mono text-sm text-[#0B4F3A] mb-2">{key}</div>
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(students[key], null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-red-500">No students found in Firebase</p>
        )}
      </Card>
    </MainLayout>
  );
};
