import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ lastUpdated, onRefresh }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowStatus(!showStatus)}
        className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
        title="Connection status"
      >
        {isOnline ? (
          <Wifi className="text-green-500" size={20} />
        ) : (
          <WifiOff className="text-red-500" size={20} />
        )}
      </button>
      
      {showStatus && (
        <div className="absolute bottom-12 right-0 w-64 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">Connection Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last update:</span>
              <span className="text-gray-800">{formatTime(lastUpdated)}</span>
            </div>
            <button
              onClick={() => {
                onRefresh();
                setShowStatus(false);
              }}
              className="w-full mt-2 px-3 py-2 bg-[#2E8B57] text-white rounded-lg hover:bg-[#3CB371] transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw size={14} />
              Refresh Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
