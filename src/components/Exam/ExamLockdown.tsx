// src/components/Exam/ExamLockdown.tsx
import React, { useEffect, useState } from 'react';

interface ExamLockdownProps {
  examId: string;
  studentEmail: string;
  children: React.ReactNode;
  maxViolations?: number;
}

export const ExamLockdown: React.FC<ExamLockdownProps> = ({
  examId,
  studentEmail,
  children,
  maxViolations = 3
}) => {
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.log('Fullscreen failed');
      }
    };
    enterFullscreen();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => prev + 1);
      }
    };

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setViolations(prev => prev + 1);
      return false;
    };

    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      setViolations(prev => prev + 1);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('contextmenu', preventRightClick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('contextmenu', preventRightClick);
      
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  if (violations >= maxViolations) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Exam Terminated</h1>
          <p>Too many violations detected.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {violations > 0 && (
        <div className="bg-yellow-500 text-white p-2 text-center">
          ⚠️ Warning: {violations} violation(s). Max {maxViolations}
        </div>
      )}
      {!isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>Fullscreen Required</h2>
            <button 
              onClick={() => document.documentElement.requestFullscreen()}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}
      <div className={!isFullscreen ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};

