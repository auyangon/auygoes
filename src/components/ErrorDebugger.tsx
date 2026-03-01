import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './Common';

export const ErrorDebugger: React.FC = () => {
  const { error, debugInfo, loading } = useData();
  const { user } = useAuth();

  if (!error && !debugInfo) return null;

  return (
    <Card className="p-6 m-4 bg-red-50 border-red-200">
      <h2 className="text-xl font-bold text-red-700 mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>ðŸ” Error Debug Info</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold">User:</p>
          <p className="text-sm font-mono bg-white p-2 rounded">{user?.email || 'No user'}</p>
        </div>
        
        <div>
          <p className="font-semibold">Error:</p>
          <p className="text-sm text-red-600 bg-white p-2 rounded">{error || 'No error'}</p>
        </div>
        
        {debugInfo && (
          <div>
            <p className="font-semibold">Debug Info:</p>
            <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4">
          <p className="font-semibold mb-2">Quick Check:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Open browser console (F12)</li>
            <li>Look for ðŸ” DEBUG messages</li>
            <li>Check which paths were tried</li>
            <li>See if any path succeeded</li>
            <li>Share the console output with support</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};
