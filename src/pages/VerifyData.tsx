// src/pages/VerifyData.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/Common';
import { encodeEmailForFirebase } from '../utils/emailUtils';

export const VerifyData: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      const encodedEmail = encodeEmailForFirebase(user.email);
      console.log('Verify - Original:', user.email);
      console.log('Verify - Encoded:', encodedEmail);
      
      const studentRef = ref(db, `students/${encodedEmail}`);
      const snapshot = await get(studentRef);
      setData(snapshot.val());
      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (!user) return <MainLayout><div>Please login</div></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-[#0B4F3A] mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Data Verification</h1>
      
      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-2">Current User</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Encoded:</strong> {encodeEmailForFirebase(user.email)}</p>
      </Card>

      <Card className="p-4">
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
    </MainLayout>
  );
};

