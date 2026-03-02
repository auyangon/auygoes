import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../components/MainLayout';
import { Card } from '../components/Common';
import { firebaseRest } from '../services/firebaseRest.service';

export const VerifyData: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Verifying data for:', user.email);
        const studentData = await firebaseRest.getStudent(user.email);
        setData(studentData);
        setError(null);
        console.log('✅ Student data:', studentData);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <MainLayout><div>Please login first</div></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-[#2E8B57] mb-4">Data Verification</h1>
      
      <Card className="p-4 mb-4">
        <h2 className="font-semibold mb-2">Current User</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Encoded:</strong> {firebaseRest.encodeEmail(user.email)}</p>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-2">Your Data</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#2E8B57] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No data found for your email</p>
        )}
      </Card>
    </MainLayout>
  );
};
