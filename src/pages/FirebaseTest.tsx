import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/Common';
import { firebaseRest } from '../services/firebaseRest.service';

export const FirebaseTest: React.FC = () => {
  const [students, setStudents] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching all students via REST API...');
        const data = await firebaseRest.getAllStudents();
        setStudents(data);
        setError(null);
        console.log('✅ Students loaded:', data);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-[#2E8B57] mb-4">Firebase Data (REST API)</h1>
      
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Student Keys in Firebase</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-2">Make sure your Firebase is accessible and the secret is correct.</p>
          </div>
        ) : students ? (
          <div>
            <p className="mb-2 text-green-600">✅ Found {Object.keys(students).length} students</p>
            <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {Object.entries(students).map(([key, value]) => (
                <div key={key} className="mb-3 p-3 bg-white rounded shadow-sm border border-gray-200">
                  <div className="font-mono text-sm text-[#2E8B57] mb-2 break-all">{key}</div>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-yellow-600">No students found in Firebase</p>
        )}
      </Card>
    </MainLayout>
  );
};
