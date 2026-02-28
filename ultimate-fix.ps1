# ============================================================================
# 🔧 ULTIMATE FIX - ADD DETAILED ERROR LOGGING
# ============================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🔧 ULTIMATE FIX - DETAILED ERROR LOGGING                 ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ultimateFix = @'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { ref, get } from 'firebase/database';

export interface Course {
  id: string;
  courseId: string;
  name: string;
  teacher: string;
  credits: number;
  grade?: string;
  attendancePercentage?: number;
}

interface DataContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  gpa: number;
  totalCredits: number;
  attendance: number;
  studentName: string;
  studentId: string;
  major: string;
  debugInfo: any; // For debugging
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const gradePoints: Record<string, number> = {
  'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gpa, setGpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      setError('No user logged in');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const debug: any = {
        userEmail: user.email,
        attempts: [],
        timestamp: new Date().toISOString()
      };

      try {
        console.log('========================================');
        console.log('🔍 DEBUG: Starting data fetch');
        console.log('📧 User email:', user.email);
        console.log('========================================');
        
        // Try different possible paths
        const paths = [
          { name: 'Raw email', path: `students/${user.email}` },
          { name: 'Sanitized (dots → commas)', path: `students/${user.email.replace(/\./g, ',,,')}` },
          { name: 'Sanitized (dots → underscores)', path: `students/${user.email.replace(/\./g, '_')}` },
          { name: 'URL encoded', path: `students/${encodeURIComponent(user.email)}` },
          { name: 'Base students path', path: 'students' }
        ];
        
        let foundData = null;
        let usedPath = '';
        
        for (const { name, path } of paths) {
          console.log(`📁 Trying [${name}]: ${path}`);
          
          try {
            const dataRef = ref(db, path);
            const snapshot = await get(dataRef);
            
            debug.attempts.push({
              name,
              path,
              exists: snapshot.exists(),
              status: snapshot.exists() ? 'SUCCESS' : 'NOT FOUND'
            });
            
            if (snapshot.exists()) {
              console.log(`✅ SUCCESS! Found data at: ${path}`);
              foundData = snapshot.val();
              usedPath = path;
              
              // If we found all students, try to find this specific student
              if (path === 'students' && foundData) {
                console.log('🔍 Searching for student in all students...');
                
                // Try exact match
                if (foundData[user.email]) {
                  foundData = foundData[user.email];
                  console.log('✅ Found exact email match');
                  debug.matchMethod = 'exact email';
                } 
                // Try case-insensitive match
                else {
                  const emailLower = user.email.toLowerCase();
                  const matchKey = Object.keys(foundData).find(
                    key => key.toLowerCase() === emailLower
                  );
                  if (matchKey) {
                    foundData = foundData[matchKey];
                    console.log(`✅ Found case-insensitive match with key: ${matchKey}`);
                    debug.matchMethod = 'case-insensitive';
                  } 
                  // Try partial match
                  else {
                    const localPart = user.email.split('@')[0];
                    const matchKey = Object.keys(foundData).find(
                      key => key.includes(localPart)
                    );
                    if (matchKey) {
                      foundData = foundData[matchKey];
                      console.log(`✅ Found partial match with key: ${matchKey}`);
                      debug.matchMethod = 'partial';
                    } else {
                      console.log('❌ No matching student found in database');
                      console.log('Available keys:', Object.keys(foundData).slice(0, 5));
                      debug.availableKeys = Object.keys(foundData).slice(0, 10);
                      foundData = null;
                    }
                  }
                }
              }
              break;
            } else {
              console.log(`❌ No data at: ${path}`);
            }
          } catch (err) {
            console.error(`❌ Error at ${path}:`, err.message);
            debug.attempts.push({
              name,
              path,
              error: err.message
            });
          }
        }
        
        if (!foundData) {
          console.error('❌ FATAL: No student data found after trying all paths');
          setError('Student record not found. Please check your email or contact administration.');
          setDebugInfo(debug);
          setLoading(false);
          return;
        }

        console.log('✅ Student data found:', foundData);
        debug.foundData = foundData;
        setDebugInfo(debug);
        
        // Extract student info with fallbacks
        setStudentName(foundData.studentName || foundData.name || foundData.displayName || '');
        setStudentId(foundData.studentId || foundData.id || '');
        setMajor(foundData.major || foundData.program || '');

        // Get courses - try different possible structures
        const coursesData = foundData.courses || foundData.enrollments || foundData.classes || {};
        const courseList: Course[] = [];

        console.log('📚 Processing courses:', coursesData);

        for (const [courseId, courseInfo] of Object.entries(coursesData)) {
          const data = courseInfo as any;
          const course: Course = {
            id: courseId,
            courseId: courseId,
            name: data.courseName || data.name || courseId,
            teacher: data.teacherName || data.teacher || data.instructor || '',
            credits: data.credits || data.creditHours || 3,
            grade: data.grade || data.finalGrade || '',
            attendancePercentage: data.attendancePercentage || data.attendance || 0
          };
          courseList.push(course);
        }

        setCourses(courseList);
        console.log(`📚 Loaded ${courseList.length} courses`);

        // Calculate GPA
        let totalPoints = 0;
        let totalCreditsEarned = 0;
        let totalAttendance = 0;

        courseList.forEach((course) => {
          if (course.grade && gradePoints[course.grade] !== undefined) {
            totalPoints += gradePoints[course.grade] * course.credits;
            totalCreditsEarned += course.credits;
          }
          if (course.attendancePercentage) {
            totalAttendance += course.attendancePercentage;
          }
        });

        setGpa(totalCreditsEarned > 0 ? Number((totalPoints / totalCreditsEarned).toFixed(2)) : 0);
        setTotalCredits(totalCreditsEarned);
        setAttendance(courseList.length ? Math.round(totalAttendance / courseList.length) : 0);
        
        console.log('✅ Data fetch complete!');
        console.log('📊 GPA:', gpa, 'Credits:', totalCredits, 'Attendance:', attendance);
        
      } catch (err) {
        console.error('❌ CRITICAL ERROR:', err);
        setError(`Failed to load data: ${err.message}`);
        setDebugInfo({ ...debug, criticalError: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <DataContext.Provider value={{
      courses, loading, error, gpa, totalCredits, attendance, 
      studentName, studentId, major, debugInfo
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
'@

$ultimateFix | Out-File -FilePath "src/contexts/DataContext.tsx" -Encoding UTF8
Write-Host "✅ Updated: src/contexts/DataContext.tsx with detailed error logging" -ForegroundColor Green

# ============================================================================
# CREATE DEBUG COMPONENT TO SHOW ERROR DETAILS
# ============================================================================
Write-Host ""
Write-Host "📝 Creating error debug component..." -ForegroundColor Yellow

$errorDebugger = @'
// src/components/ErrorDebugger.tsx
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
      <h2 className="text-xl font-bold text-red-700 mb-4">🔍 Error Debug Info</h2>
      
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
            <li>Look for 🔍 DEBUG messages</li>
            <li>Check which paths were tried</li>
            <li>See if any path succeeded</li>
            <li>Share the console output with support</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};
'@

$errorDebugger | Out-File -FilePath "src/components/ErrorDebugger.tsx" -Encoding UTF8
Write-Host "✅ Created: src/components/ErrorDebugger.tsx" -ForegroundColor Green

# ============================================================================
# UPDATE DASHBOARD TO SHOW ERROR DEBUGGER
# ============================================================================
Write-Host ""
Write-Host "📝 Updating Dashboard to show error details..." -ForegroundColor Yellow

$dashboardUpdate = @'
// Add this import at the top of Dashboard.tsx
import { ErrorDebugger } from '../components/ErrorDebugger';

// Then add this right after the MainLayout opening tag, before your content:
<ErrorDebugger />
'@

$dashboardUpdate | Out-File -FilePath "DASHBOARD-UPDATE.txt" -Encoding UTF8
Write-Host "✅ Created: DASHBOARD-UPDATE.txt - Instructions to add ErrorDebugger" -ForegroundColor Green

# ============================================================================
# CREATE CONSOLE HELPER
# ============================================================================
Write-Host ""
Write-Host "📝 Creating console helper..." -ForegroundColor Yellow

$consoleHelper = @'
// Copy and paste this into your browser console (F12)

console.log('🔍 MANUAL FIREBASE CHECK');
console.log('=======================');

// Get the current user
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const auth = getAuth();
const user = auth.currentUser;

if (!user) {
  console.log('❌ No user logged in');
} else {
  console.log('✅ User:', user.email);
  
  const db = getDatabase();
  const paths = [
    `students/${user.email}`,
    `students/${user.email.replace(/\./g, ',,,')}`,
    `students/${user.email.replace(/\./g, '_')}`,
    'students'
  ];
  
  paths.forEach(async (path) => {
    try {
      const snapshot = await get(ref(db, path));
      console.log(`📁 ${path}:`, snapshot.exists() ? '✅ FOUND' : '❌ NOT FOUND');
      if (snapshot.exists() && path === 'students') {
        const data = snapshot.val();
        console.log('   Available keys:', Object.keys(data).slice(0, 5));
      }
    } catch (e) {
      console.log(`📁 ${path}: ❌ ERROR -`, e.message);
    }
  });
}
'@

$consoleHelper | Out-File -FilePath "CONSOLE-HELPER.txt" -Encoding UTF8
Write-Host "✅ Created: CONSOLE-HELPER.txt" -ForegroundColor Green

# ============================================================================
# COMPLETION
# ============================================================================
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ ULTIMATE FIX INSTALLED!                               ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Run your app: npm run dev" -ForegroundColor Cyan
Write-Host "  2. Login with your email" -ForegroundColor Cyan
Write-Host "  3. OPEN BROWSER CONSOLE (F12)" -ForegroundColor Magenta
Write-Host "  4. Look for 🔍 DEBUG messages" -ForegroundColor Cyan
Write-Host "  5. COPY THE ENTIRE CONSOLE OUTPUT" -ForegroundColor Yellow
Write-Host "  6. PASTE IT HERE" -ForegroundColor Green
Write-Host ""
Write-Host "📋 The console will show:" -ForegroundColor White
Write-Host "  • Which paths were tried" -ForegroundColor Gray
Write-Host "  • Which paths succeeded/failed" -ForegroundColor Gray
Write-Host "  • Available student keys in database" -ForegroundColor Gray
Write-Host "  • Exact error messages" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 After getting the console output, run:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Add detailed error logging for debugging'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White