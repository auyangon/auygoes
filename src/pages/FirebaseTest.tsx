import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0B4F3A] mb-4">Firebase Data Test</h1>
      
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Student Keys in Firebase</h2>
        {students ? (
          <div>
            <p className="mb-2">Found {Object.keys(students).length} students</p>
            <div className="bg-gray-100 p-4 rounded">
              {Object.keys(students).map(key => (
                <div key={key} className="mb-2 p-2 bg-white rounded">
                  <code className="text-sm">{key}</code>
                  <pre className="text-xs mt-1 text-gray-600">
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
    </div>
  );
};
