import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { Card } from '../components/Common';

export const VerifyData: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<any>(null);

  const encodeEmail = (email: string) => {
    return email.replace(/\./g, ',');
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      const encodedEmail = encodeEmail(user.email);
      console.log('🔍 Verify - Original:', user.email);
      console.log('🔑 Verify - Encoded:', encodedEmail);
      
      // Get specific student
      const studentRef = ref(db, `students/${encodedEmail}`);
      const snapshot = await get(studentRef);
      setData(snapshot.val());
      
      // Get all students to see keys
      const allRef = ref(db, 'students');
      const allSnap = await get(allRef);
      if (allSnap.exists()) {
        setAllStudents(allSnap.val());
        console.log('📋 Available student keys:', Object.keys(allSnap.val()));
      }
      
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (!user) return <div className="p-6">Please login first</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0B4F3A] mb-4">Data Verification</h1>
      
      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-2">Current User</h2>
        <p><strong>Original Email:</strong> {user.email}</p>
        <p><strong>Encoded for Firebase:</strong> {encodeEmail(user.email)}</p>
      </Card>

      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-2">Your Data</h2>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No data found for your email</p>
        )}
      </Card>

      {allStudents && (
        <Card className="p-4">
          <h2 className="font-semibold mb-2">All Student Keys in Firebase</h2>
          <div className="bg-gray-100 p-4 rounded">
            {Object.keys(allStudents).map(key => (
              <div key={key} className="mb-1 font-mono text-sm">
                {key}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
