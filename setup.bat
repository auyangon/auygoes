@echo off
echo Creating project structure...

:: Create folders
mkdir src\lib 2>nul
mkdir src\contexts 2>nul
mkdir src\components 2>nul
mkdir src\pages 2>nul
mkdir src\utils 2>nul

:: ========== firebase.ts ==========
(
echo import { initializeApp } from 'firebase/app';
echo import { getAuth } from 'firebase/auth';
echo import { getDatabase } from 'firebase/database';
echo.
echo const firebaseConfig = ^{
echo   apiKey: "AIzaSyDMaoB6mOKYJOkDGwCmliz0azqtJifbwpY",
echo   authDomain: "auy-portal-v2.firebaseapp.com",
echo   databaseURL: "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
echo   projectId: "auy-portal-v2",
echo   storageBucket: "auy-portal-v2.firebasestorage.app",
echo   messagingSenderId: "1092101561903",
echo   appId: "1:1092101561903:web:07abc804196ff95bc2f0da"
echo ^};
echo.
echo const app = initializeApp(firebaseConfig^);
echo export const auth = getAuth(app^);
echo export const db = getDatabase(app^);
) > src\lib\firebase.ts

:: ========== AuthContext.tsx ==========
(
echo import React, { createContext, useContext, useEffect, useState } from 'react';
echo import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
echo import { auth } from '../lib/firebase';
echo.
echo interface AuthContextType ^{
echo   user: User ^| null;
echo   loading: boolean;
echo   signIn: (email: string, password: string^) =^> Promise^<void^>;
echo   logout: (^) =^> Promise^<void^>;
echo ^}
echo.
echo const AuthContext = createContext^<AuthContextType ^| undefined^>(undefined^);
echo.
echo export function AuthProvider({ children }: { children: React.ReactNode }) ^{
echo   const [user, setUser] = useState^<User ^| null^>(null^);
echo   const [loading, setLoading] = useState(true^);
echo.
echo   useEffect((^) =^> ^{
echo     const unsubscribe = onAuthStateChanged(auth, (user^) =^> ^{
echo       setUser(user^);
echo       setLoading(false^);
echo     ^});
echo     return unsubscribe;
echo   }, []^);
echo.
echo   const signIn = async (email: string, password: string^) =^> ^{
echo     await signInWithEmailAndPassword(auth, email, password^);
echo   ^};
echo.
echo   const logout = async (^) =^> ^{
echo     await signOut(auth^);
echo   ^};
echo.
echo   return (
echo     ^<AuthContext.Provider value={{ user, loading, signIn, logout }}^>
echo       {children}
echo     ^</AuthContext.Provider^>
echo   );
echo ^}
echo.
echo export function useAuth(^) ^{
echo   const context = useContext(AuthContext^);
echo   if (!context) throw new Error('useAuth must be used within AuthProvider'^);
echo   return context;
echo ^}
) > src\contexts\AuthContext.tsx

:: ========== DataContext.tsx ==========
(
echo import React, { createContext, useContext, useEffect, useState } from 'react';
echo import { ref, get } from 'firebase/database';
echo import { db } from '../lib/firebase';
echo import { useAuth } from './AuthContext';
echo.
echo export interface Course ^{
echo   id: string;
echo   courseId: string;
echo   courseName: string;
echo   teacherName: string;
echo   credits: number;
echo   grade: string;
echo   attendancePercentage: number;
echo   googleClassroomLink?: string;
echo ^}
echo.
echo export interface Student ^{
echo   studentId: string;
echo   studentName: string;
echo   email: string;
echo   studyMode: string;
echo   major: string;
echo ^}
echo.
echo interface DataContextType ^{
echo   courses: Course[];
echo   student: Student ^| null;
echo   gpa: number;
echo   totalCredits: number;
echo   averageAttendance: number;
echo   loading: boolean;
echo   error: string ^| null;
echo ^}
echo.
echo const DataContext = createContext^<DataContextType ^| undefined^>(undefined^);
echo.
echo const GRADE_POINTS: Record^<string, number^> = ^{
echo   'A': 4.0, 'A-': 3.7,
echo   'B+': 3.3, 'B': 3.0, 'B-': 2.7,
echo   'C+': 2.3, 'C': 2.0, 'C-': 1.7,
echo   'D+': 1.3, 'D': 1.0,
echo   'F': 0.0
echo ^};
echo.
echo function encodeEmail(email: string^): string ^{
echo   return email.replace(/\./g, ',,,'^).replace(/@/g, ',,@,,'^);
echo ^}
echo.
echo export function DataProvider({ children }: { children: React.ReactNode }) ^{
echo   const { user } = useAuth(^);
echo   const [courses, setCourses] = useState^<Course[]^>([]^);
echo   const [student, setStudent] = useState^<Student ^| null^>(null^);
echo   const [gpa, setGpa] = useState(0^);
echo   const [totalCredits, setTotalCredits] = useState(0^);
echo   const [averageAttendance, setAverageAttendance] = useState(0^);
echo   const [loading, setLoading] = useState(true^);
echo   const [error, setError] = useState^<string ^| null^>(null^);
echo.
echo   useEffect((^) =^> ^{
echo     async function fetchStudentData(^) ^{
echo       if (!user?.email) ^{
echo         setLoading(false^);
echo         return;
echo       ^}
echo.
echo       try ^{
echo         const encoded = encodeEmail(user.email^);
echo         console.log('Fetching student with key:', encoded^);
echo         const studentRef = ref(db, `students/${encoded}`^);
echo         const snapshot = await get(studentRef^);
echo.
echo         if (!snapshot.exists(^)) ^{
echo           setError('Student record not found'^);
echo           setLoading(false^);
echo           return;
echo         ^}
echo.
echo         const data = snapshot.val(^);
echo.
echo         setStudent(^{
echo           studentId: data.studentId,
echo           studentName: data.studentName,
echo           email: data.email,
echo           studyMode: data.studyMode,
echo           major: data.major,
echo         ^}^);
echo.
echo         const courseList: Course[] = [];
echo         let totalGradePoints = 0;
echo         let totalCreditsEarned = 0;
echo         let totalAttendance = 0;
echo         let attendanceCount = 0;
echo.
echo         if (data.courses) ^{
echo           Object.entries(data.courses^).forEach(([id, c]: any^) =^> ^{
echo             courseList.push(^{
echo               id,
echo               courseId: id,
echo               courseName: c.courseName,
echo               teacherName: c.teacherName,
echo               credits: c.credits,
echo               grade: c.grade,
echo               attendancePercentage: c.attendancePercentage,
echo               googleClassroomLink: c.googleClassroomLink,
echo             ^}^);
echo.
echo             const points = GRADE_POINTS[c.grade] ^|^| 0;
echo             totalGradePoints += points * c.credits;
echo             totalCreditsEarned += c.credits;
echo.
echo             if (c.attendancePercentage) ^{
echo               totalAttendance += c.attendancePercentage;
echo               attendanceCount++;
echo             ^}
echo           ^}^);
echo         ^}
echo.
echo         setCourses(courseList^);
echo         setGpa(totalCreditsEarned > 0 ? totalGradePoints / totalCreditsEarned : 0^);
echo         setTotalCredits(totalCreditsEarned^);
echo         setAverageAttendance(attendanceCount > 0 ? totalAttendance / attendanceCount : 0^);
echo       ^} catch (err) ^{
echo         console.error(err^);
echo         setError('Failed to load data'^);
echo       ^} finally ^{
echo         setLoading(false^);
echo       ^}
echo     ^}
echo.
echo     fetchStudentData(^);
echo   }, [user]^);
echo.
echo   return (
echo     ^<DataContext.Provider value={{ courses, student, gpa, totalCredits, averageAttendance, loading, error }}^>
echo       {children}
echo     ^</DataContext.Provider^>
echo   );
echo ^}
echo.
echo export function useData(^) ^{
echo   const context = useContext(DataContext^);
echo   if (!context) throw new Error('useData must be used within DataProvider'^);
echo   return context;
echo ^}
) > src\contexts\DataContext.tsx

:: ========== ProtectedRoute.tsx ==========
(
echo import { Navigate } from 'react-router-dom';
echo import { useAuth } from '../contexts/AuthContext';
echo.
echo export function ProtectedRoute({ children }: { children: React.ReactNode }) ^{
echo   const { user, loading } = useAuth(^);
echo.
echo   if (loading) ^{
echo     return (
echo       ^<div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center"^>
echo         ^<div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /^>
echo       ^</div^>
echo     );
echo   ^}
echo.
echo   if (!user) ^{
echo     return ^<Navigate to="/login" replace /^>;
echo   ^}
echo.
echo   return ^<^>{children}^<^>;
echo ^}
) > src\components\ProtectedRoute.tsx

:: ========== Common.tsx ==========
(
echo import { cn } from '../utils/cn';
echo.
echo interface GlassCardProps ^{
echo   children: React.ReactNode;
echo   className?: string;
echo   hover?: boolean;
echo ^}
echo.
echo export function GlassCard({ children, className, hover = false }: GlassCardProps) ^{
echo   return (
echo     ^<div
echo       className={cn(
echo         'backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl',
echo         hover ^&^& 'transition-transform duration-300 hover:scale-[1.02] hover:bg-white/15 hover:border-white/30',
echo         className
echo       )}
echo     ^>
echo       {children}
echo     ^</div^>
echo   );
echo ^}
echo.
echo export function Spinner({ size = 'lg' }: { size?: 'sm' ^| 'md' ^| 'lg' }) ^{
echo   const sizeClasses = ^{
echo     sm: 'w-5 h-5 border-2',
echo     md: 'w-8 h-8 border-3',
echo     lg: 'w-12 h-12 border-4',
echo   ^};
echo   return (
echo     ^<div className="flex items-center justify-center"^>
echo       ^<div className={cn('rounded-full animate-spin border-emerald-500/20 border-t-emerald-400', sizeClasses[size]^)} /^>
echo     ^</div^>
echo   );
echo ^}
echo.
echo export function SectionTitle({ children, subtitle, className }: { children: React.ReactNode; subtitle?: string; className?: string }) ^{
echo   return (
echo     ^<div className={cn('mb-6', className^)}^>
echo       ^<h2 className="text-2xl font-bold text-white/90 tracking-tight"^>{children}^</h2^>
echo       {subtitle ^&^& ^<p className="text-sm text-white/40 mt-1"^>{subtitle}^</p^>}
echo     ^</div^>
echo   );
echo ^}
echo.
echo export function GradeColor({ grade }: { grade: string }) ^{
echo   const colorMap: Record^<string, string^> = ^{
echo     'A+': 'text-emerald-300',
echo     'A': 'text-emerald-300',
echo     'A-': 'text-emerald-400',
echo     'B+': 'text-blue-300',
echo     'B': 'text-blue-300',
echo     'B-': 'text-blue-400',
echo     'C+': 'text-yellow-300',
echo     'C': 'text-yellow-300',
echo     'C-': 'text-yellow-400',
echo     'D+': 'text-orange-300',
echo     'D': 'text-orange-300',
echo     'F': 'text-red-400',
echo   ^};
echo   return (
echo     ^<span className={cn('font-bold', colorMap[grade] ?? 'text-white/60'^)}^>
echo       {grade ^|^| '—'}
echo     ^</span^>
echo   );
echo ^}
) > src\components\Common.tsx

:: ========== MainLayout.tsx ==========
(
echo import { Outlet } from 'react-router-dom';
echo import { useAuth } from '../contexts/AuthContext';
echo import { LogOut } from 'lucide-react';
echo.
echo export default function MainLayout(^) ^{
echo   const { logout } = useAuth(^);
echo   return (
echo     ^<div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950"^>
echo       ^<div className="p-6"^>
echo         ^<div className="max-w-7xl mx-auto"^>
echo           ^<div className="flex justify-end mb-4"^>
echo             ^<button
echo               onClick={logout}
echo               className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 hover:text-white transition"
echo             ^>
echo               ^<LogOut size={16} /^>
echo               Logout
echo             ^</button^>
echo           ^</div^>
echo           ^<Outlet /^>
echo         ^</div^>
echo       ^</div^>
echo     ^</div^>
echo   );
echo ^}
) > src\components\MainLayout.tsx

:: ========== Login.tsx ==========
(
echo import { useState } from 'react';
echo import { useAuth } from '../contexts/AuthContext';
echo import { GlassCard } from '../components/Common';
echo import { useNavigate } from 'react-router-dom';
echo.
echo export function Login(^) ^{
echo   const [email, setEmail] = useState('');
echo   const [password, setPassword] = useState('');
echo   const [error, setError] = useState('');
echo   const { signIn } = useAuth(^);
echo   const navigate = useNavigate(^);
echo.
echo   const handleSubmit = async (e: React.FormEvent^) =^> ^{
echo     e.preventDefault(^);
echo     try ^{
echo       await signIn(email, password^);
echo       navigate('/'^);
echo     ^} catch (err: any) ^{
echo       setError(err.message^);
echo     ^}
echo   ^};
echo.
echo   return (
echo     ^<div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4"^>
echo       ^<GlassCard className="p-8 max-w-md w-full"^>
echo         ^<h1 className="text-3xl font-light text-white mb-2 text-center"^>AUY Student Portal^</h1^>
echo         ^<p className="text-white/70 text-center mb-8"^>Sign in with your email^</p^>
echo         ^<form onSubmit={handleSubmit} className="space-y-4"^>
echo           ^<input
echo             type="email"
echo             placeholder="Email"
echo             value={email}
echo             onChange={(e^) =^> setEmail(e.target.value^)}
echo             className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50"
echo             required
echo           /^>
echo           ^<input
echo             type="password"
echo             placeholder="Password"
echo             value={password}
echo             onChange={(e^) =^> setPassword(e.target.value^)}
echo             className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50"
echo             required
echo           /^>
echo           {error ^&^& ^<p className="text-red-400 text-sm"^>{error}^</p^>}
echo           ^<button
echo             type="submit"
echo             className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition"
echo           ^>
echo             Sign In
echo           ^</button^>
echo         ^</form^>
echo         ^<p className="text-white/40 text-xs text-center mt-6"^>
echo           Use your university email and password
echo         ^</p^>
echo       ^</GlassCard^>
echo     ^</div^>
echo   );
echo ^}
) > src\pages\Login.tsx

:: ========== Dashboard.tsx ==========
(
echo import { motion } from 'framer-motion';
echo import type { Variants } from 'framer-motion';
echo import { User, Award, BookOpen, ArrowUpRight, CheckCircle2, Calendar } from 'lucide-react';
echo import { useData } from '../contexts/DataContext';
echo import { GlassCard, SectionTitle, Spinner, GradeColor } from '../components/Common';
echo import { Link } from 'react-router-dom';
echo.
echo const stagger: Variants = ^{
echo   hidden: {},
echo   show: ^{ transition: { staggerChildren: 0.08 } },
echo ^};
echo.
echo const fadeUp: Variants = ^{
echo   hidden: { opacity: 0, y: 20 },
echo   show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
echo ^};
echo.
echo function GPARing({ gpa }: { gpa: number }) ^{
echo   const percentage = (gpa / 4^) * 100;
echo   const circumference = 2 * Math.PI * 54;
echo   const offset = circumference - (percentage / 100^) * circumference;
echo.
echo   return (
echo     ^<div className="relative w-36 h-36 mx-auto"^>
echo       ^<svg className="w-full h-full -rotate-90" viewBox="0 0 120 120"^>
echo         ^<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06^)" strokeWidth="8" /^>
echo         ^<motion.circle
echo           cx="60"
echo           cy="60"
echo           r="54"
echo           fill="none"
echo           stroke="url(#gpaGradient^)"
echo           strokeWidth="8"
echo           strokeLinecap="round"
echo           strokeDasharray={circumference}
echo           initial={{ strokeDashoffset: circumference }}
echo           animate={{ strokeDashoffset: offset }}
echo           transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
echo         /^>
echo         ^<defs^>
echo           ^<linearGradient id="gpaGradient" x1="0%" y1="0%" x2="100%" y2="100%"^>
echo             ^<stop offset="0%" stopColor="#34d399" /^>
echo             ^<stop offset="100%" stopColor="#06b6d4" /^>
echo           ^</linearGradient^>
echo         ^</defs^>
echo       ^</svg^>
echo       ^<div className="absolute inset-0 flex flex-col items-center justify-center"^>
echo         ^<span className="text-3xl font-bold text-white/90"^>{gpa.toFixed(2^)}^</span^>
echo         ^<span className="text-[10px] text-white/40 uppercase tracking-widest"^>GPA^</span^>
echo       ^</div^>
echo     ^</div^>
echo   );
echo ^}
echo.
echo export default function Dashboard(^) ^{
echo   const { student, courses, gpa, totalCredits, averageAttendance, loading, error } = useData(^);
echo.
echo   if (loading) return ^<Spinner size="lg" /^>;
echo   if (error) return ^<div className="text-white/70 text-center py-12"^>{error}^</div^>;
echo.
echo   const displayCourses = courses.slice(0, 4^);
echo.
echo   return (
echo     ^<motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6"^>
echo       ^<motion.div variants={fadeUp} className="flex items-start justify-between"^>
echo         ^<div^>
echo           ^<h1 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight"^>
echo             Welcome back{student?.studentName ? `, ${student.studentName.split(' '^)[0]}` : ''}
echo           ^</h1^>
echo           ^<p className="text-white/40 mt-1 text-sm"^>Here's your academic overview^</p^>
echo         ^</div^>
echo       ^</motion.div^>
echo.
echo       ^<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"^>
echo         ^<motion.div variants={fadeUp} className="sm:col-span-2 lg:col-span-1"^>
echo           ^<GlassCard className="p-6 h-full" hover^>
echo             ^<div className="flex items-center gap-3 mb-4"^>
echo               ^<div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center"^>
echo                 ^<User className="w-6 h-6 text-emerald-300" /^>
echo               ^</div^>
echo               ^<div className="min-w-0"^>
echo                 ^<p className="text-sm font-semibold text-white/90 truncate"^>{student?.studentName}^</p^>
echo                 ^<p className="text-xs text-white/40 truncate"^>{student?.studentId}^</p^>
echo               ^</div^>
echo             ^</div^>
echo             ^<div className="space-y-2"^>
echo               ^<div className="flex justify-between text-xs"^>
echo                 ^<span className="text-white/40"^>Major^</span^>
echo                 ^<span className="text-white/70 font-medium"^>{student?.major}^</span^>
echo               ^</div^>
echo               ^<div className="flex justify-between text-xs"^>
echo                 ^<span className="text-white/40"^>Mode^</span^>
echo                 ^<span className="text-white/70 font-medium"^>{student?.studyMode}^</span^>
echo               ^</div^>
echo               ^<div className="flex justify-between text-xs"^>
echo                 ^<span className="text-white/40"^>Attendance^</span^>
echo                 ^<span className="text-emerald-300 font-medium"^>{averageAttendance.toFixed(0^)}%^</span^>
echo               ^</div^>
echo             ^</div^>
echo           ^</GlassCard^>
echo         ^</motion.div^>
echo.
echo         ^<motion.div variants={fadeUp}^>
echo           ^<GlassCard className="p-6 h-full flex flex-col items-center justify-center" hover^>
echo             ^<GPARing gpa={gpa} /^>
echo             ^<p className="text-xs text-white/40 mt-3 text-center"^>Cumulative GPA^</p^>
echo           ^</GlassCard^>
echo         ^</motion.div^>
echo.
echo         ^<motion.div variants={fadeUp}^>
echo           ^<GlassCard className="p-6 h-full" hover^>
echo             ^<div className="w-10 h-10 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-4"^>
echo               ^<Award className="w-5 h-5 text-cyan-300" /^>
echo             ^</div^>
echo             ^<p className="text-3xl font-bold text-white/90"^>{totalCredits}^</p^>
echo             ^<p className="text-xs text-white/40 mt-1"^>Credits Earned^</p^>
echo             ^<div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden"^>
echo               ^<motion.div
echo                 className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
echo                 initial={{ width: 0 }}
echo                 animate={{ width: `${Math.min((totalCredits / 124^) * 100, 100^)}%` }}
echo                 transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
echo               /^>
echo             ^</div^>
echo             ^<p className="text-[10px] text-white/30 mt-1.5"^>{totalCredits} / 124 required^</p^>
echo           ^</GlassCard^>
echo         ^</motion.div^>
echo.
echo         ^<motion.div variants={fadeUp}^>
echo           ^<GlassCard className="p-6 h-full" hover^>
echo             ^<div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-4"^>
echo               ^<Calendar className="w-5 h-5 text-emerald-300" /^>
echo             ^</div^>
echo             ^<p className="text-3xl font-bold text-white/90"^>{averageAttendance.toFixed(0^)}%^</p^>
echo             ^<p className="text-xs text-white/40 mt-1"^>Avg Attendance^</p^>
echo             ^<div className="mt-4 h-1.5 bg-white/[0.06] rounded-full overflow-hidden"^>
echo               ^<motion.div
echo                 className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
echo                 initial={{ width: 0 }}
echo                 animate={{ width: `${averageAttendance}%` }}
echo                 transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
echo               /^>
echo             ^</div^>
echo             ^<p className="text-[10px] text-white/30 mt-1.5"^>{courses.length} courses tracked^</p^>
echo           ^</GlassCard^>
echo         ^</motion.div^>
echo       ^</div^>
echo.
echo       ^<motion.div variants={fadeUp}^>
echo         ^<div className="flex items-center justify-between mb-4"^>
echo           ^<SectionTitle className="mb-0"^>Current Courses^</SectionTitle^>
echo           ^<Link to="/courses" className="flex items-center gap-1 text-xs text-emerald-400/70 hover:text-emerald-300"^>
echo             View all ^<ArrowUpRight className="w-3.5 h-3.5" /^>
echo           ^</Link^>
echo         ^</div^>
echo         ^<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"^>
echo           {displayCourses.length > 0 ? displayCourses.map((course^) =^> (
echo             ^<motion.div key={course.courseId} variants={fadeUp}^>
echo               ^<GlassCard className="p-5" hover^>
echo                 ^<div className="flex items-start justify-between mb-3"^>
echo                   ^<div className="min-w-0 flex-1"^>
echo                     ^<p className="text-sm font-semibold text-white/90 truncate"^>{course.courseName}^</p^>
echo                     ^<p className="text-xs text-white/40 mt-0.5"^>{course.courseId}^</p^>
echo                   ^</div^>
echo                   ^<GradeColor grade={course.grade} /^>
echo                 ^</div^>
echo                 ^<div className="flex items-center gap-4 text-xs text-white/40"^>
echo                   ^<span className="flex items-center gap-1"^>
echo                     ^<BookOpen className="w-3.5 h-3.5" /^> {course.credits} credits
echo                   ^</span^>
echo                   ^<span className="flex items-center gap-1"^>
echo                     ^<CheckCircle2 className="w-3.5 h-3.5" /^> {course.attendancePercentage}%
echo                   ^</span^>
echo                 ^</div^>
echo               ^</GlassCard^>
echo             ^</motion.div^>
echo           ^)^) : (
echo             ^<p className="text-white/50 col-span-2 text-center py-8"^>No courses found.^</p^>
echo           ^)}
echo         ^</div^>
echo       ^</motion.div^>
echo     ^</motion.div^>
echo   );
echo ^}
) > src\pages\Dashboard.tsx

:: ========== App.tsx ==========
(
echo import { BrowserRouter, Routes, Route } from 'react-router-dom';
echo import { AuthProvider } from './contexts/AuthContext';
echo import { DataProvider } from './contexts/DataContext';
echo import { ProtectedRoute } from './components/ProtectedRoute';
echo import MainLayout from './components/MainLayout';
echo import { Login } from './pages/Login';
echo import Dashboard from './pages/Dashboard';
echo import Courses from './pages/Courses';
echo import Grades from './pages/Grades';
echo import Materials from './pages/Materials';
echo import Progress from './pages/Progress';
echo.
echo export default function App(^) ^{
echo   return (
echo     ^<AuthProvider^>
echo       ^<DataProvider^>
echo         ^<BrowserRouter^>
echo           ^<Routes^>
echo             ^<Route path="/login" element={^<Login /^>} /^>
echo             ^<Route element={^<ProtectedRoute^>^<MainLayout /^>^</ProtectedRoute^>}^>
echo               ^<Route path="/" element={^<Dashboard /^>} /^>
echo               ^<Route path="/courses" element={^<Courses /^>} /^>
echo               ^<Route path="/grades" element={^<Grades /^>} /^>
echo               ^<Route path="/materials" element={^<Materials /^>} /^>
echo               ^<Route path="/progress" element={^<Progress /^>} /^>
echo             ^</Route^>
echo           ^</Routes^>
echo         ^</BrowserRouter^>
echo       ^</DataProvider^>
echo     ^</AuthProvider^>
echo   );
echo ^}
) > src\App.tsx

:: ========== main.tsx ==========
(
echo import React from 'react';
echo import ReactDOM from 'react-dom/client';
echo import App from './App';
echo import './index.css';
echo.
echo ReactDOM.createRoot(document.getElementById('root'^)!^).render(
echo   ^<React.StrictMode^>
echo     ^<App /^>
echo   ^</React.StrictMode^>
echo );
) > src\main.tsx

:: ========== index.css ==========
(
echo @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo @keyframes float ^{
echo   0%%, 100%% { transform: translateY(0px); }
echo   50%% { transform: translateY(-20px); }
echo ^}
echo @keyframes float-slow ^{
echo   0%%, 100%% { transform: translateY(0px); }
echo   50%% { transform: translateY(-10px); }
echo ^}
echo @keyframes pulse-glow ^{
echo   0%%, 100%% { opacity: 0.3; }
echo   50%% { opacity: 0.5; }
echo ^}
echo .animate-float { animation: float 8s ease-in-out infinite; }
echo .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
echo .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
echo.
echo body {
echo   margin: 0;
echo   font-family: 'Inter', sans-serif;
echo   -webkit-font-smoothing: antialiased;
echo   -moz-osx-font-smoothing: grayscale;
echo }
echo.
echo ::-webkit-scrollbar {
echo   width: 6px;
echo   height: 6px;
echo }
echo ::-webkit-scrollbar-track { background: transparent; }
echo ::-webkit-scrollbar-thumb {
echo   background: rgba(255,255,255,0.1);
echo   border-radius: 3px;
echo }
echo ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
) > src\index.css

:: ========== utils/cn.ts ==========
(
echo import { clsx, type ClassValue } from 'clsx';
echo import { twMerge } from 'tailwind-merge';
echo.
echo export function cn(...inputs: ClassValue[]^) ^{
echo   return twMerge(clsx(inputs^)^);
echo ^}
) > src\utils\cn.ts

echo.
echo ✅ All files created successfully!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open http://localhost:5173
pause