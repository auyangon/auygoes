// src/components/Exam/ExamLockdown.tsx
import React, { useEffect, useState, useRef } from 'react';
import { examService } from '../../services/exam/exam.service';

interface ExamLockdownProps {
  examId: string;
  studentEmail: string;
  children: React.ReactNode;
  onViolation?: (type: string) => void;
  maxViolations?: number;
  onTerminate?: () => void;
}

export const ExamLockdown: React.FC<ExamLockdownProps> = ({
  examId,
  studentEmail,
  children,
  onViolation,
  maxViolations = 3,
  onTerminate
}) => {
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const violationCountRef = useRef(0);

  useEffect(() => {
    // Force fullscreen on start
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        logViolation('fullscreen-failed');
        setWarningMessage('Please enable fullscreen mode to continue the exam.');
        setShowWarning(true);
      }
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(enterFullscreen, 500);

    // Prevent tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('tab-switch');
        setWarningMessage('Do not switch tabs during the exam!');
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    // Prevent copy/paste
    const preventClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('copy-paste');
      setWarningMessage('Copy/paste is not allowed during the exam!');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return false;
    };

    // Prevent right click
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      logViolation('right-click');
      return false;
    };

    // Detect fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        logViolation('fullscreen-exit');
        setWarningMessage('Exam must be taken in fullscreen mode!');
        setShowWarning(true);
        
        // Attempt to re-enter fullscreen
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        setIsFullscreen(true);
        setShowWarning(false);
      }
    };

    // Detect window blur (user clicked outside)
    const handleBlur = () => {
      logViolation('window-blur');
    };

    // Detect keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a') {
          e.preventDefault();
          logViolation('keyboard-shortcut');
        }
      }
      
      // Prevent F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        logViolation('dev-tools');
      }
      
      // Prevent Alt+Tab detection (limited)
      if (e.altKey && e.key === 'Tab') {
        logViolation('alt-tab');
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', preventClipboard);
    document.addEventListener('paste', preventClipboard);
    document.addEventListener('cut', preventClipboard);
    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', preventClipboard);
      document.removeEventListener('paste', preventClipboard);
      document.removeEventListener('cut', preventClipboard);
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      
      // Exit fullscreen when component unmounts
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [examId, studentEmail]);

  const logViolation = async (type: string) => {
    const newCount = violationCountRef.current + 1;
    violationCountRef.current = newCount;
    setViolations(newCount);
    
    await examService.logViolation(examId, studentEmail, { type });
    
    if (onViolation) {
      onViolation(type);
    }
    
    if (newCount >= maxViolations) {
      setWarningMessage( Maximum violations () reached. Exam terminated.);
      setShowWarning(true);
      
      // Terminate exam after showing message
      setTimeout(() => {
        if (onTerminate) {
          onTerminate();
        } else {
          window.location.href = '/exam-terminated';
        }
      }, 3000);
    }
  };

  if (violations >= maxViolations) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Exam Terminated</h1>
          <p className="text-gray-600 mb-4">
            Your exam has been terminated due to multiple security violations.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Violations detected: {violations}/{maxViolations}
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-lockdown relative">
      {/* Warning Banner */}
      {violations > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50 animate-pulse">
           Warning: {violations} violation(s) detected. Maximum {maxViolations} allowed.
        </div>
      )}
      
      {/* Modal Warning */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md text-center animate-bounce">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-bold text-yellow-600 mb-2">Security Warning</h3>
            <p className="text-gray-700">{warningMessage}</p>
          </div>
        </div>
      )}
      
      {/* Fullscreen Overlay */}
      {!isFullscreen && violations < maxViolations && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Fullscreen Required</h2>
            <p className="text-gray-600 mb-4">
              This exam must be taken in fullscreen mode. Please click the button below to continue.
            </p>
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}
      
      {/* Exam Content */}
      <div className={!isFullscreen ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};
