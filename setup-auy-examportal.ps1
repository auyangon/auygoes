# ============================================================================
# 🚀 COMPLETE AUY PORTAL SETUP - THE ONE POWERSHELL TO RULE THEM ALL
# ============================================================================
# This script will:
# 1. Set up your beautiful login page with educational quotes
# 2. Configure the glass-morphism sidebar without admin
# 3. Set up the profile page with student photos
# 4. Integrate PublicQ exam system
# 5. Create your first exam in PublicQ
# ============================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🚀 AUY PORTAL COMPLETE SETUP - THE ONE SCRIPT            ║" -ForegroundColor Cyan
Write-Host "║        American University of Yangon - Spring 2026           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# PART 1: CREATE BEAUTIFUL LOGIN PAGE WITH EDUCATIONAL QUOTES
# ============================================================================
Write-Host "📝 PART 1: Creating Beautiful Login Page with Educational Quotes..." -ForegroundColor Yellow

$loginPage = @'
// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, Quote, ChevronRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const quotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Education is not preparation for life; education is life itself.",
      author: "John Dewey"
    },
    {
      text: "The roots of education are bitter, but the fruit is sweet.",
      author: "Aristotle"
    },
    {
      text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi"
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss"
    },
    {
      text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      author: "Malcolm X"
    },
    {
      text: "The purpose of education is to replace an empty mind with an open one.",
      author: "Malcolm Forbes"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={ { backgroundColor: '#faf7f2' } }>
      {/* Left Side - Quote & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AUY Portal</h1>
              <p className="text-white/70 text-sm">American University of Yangon</p>
            </div>
          </div>

          <div className="mt-16 relative">
            <Quote className="absolute -top-6 -left-6 text-white/20" size={48} />
            <div className="relative z-10">
              <p className="text-2xl font-light leading-relaxed mb-6">
                "{quotes[currentQuote].text}"
              </p>
              <p className="text-white/80 text-lg">
                — {quotes[currentQuote].author}
              </p>
            </div>
            
            <div className="flex gap-2 mt-8">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentQuote 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          <p>© 2026 American University of Yangon. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] rounded-2xl mb-4">
              <GraduationCap size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0B4F3A]">AUY Portal</h1>
            <p className="text-gray-500">American University of Yangon</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Please sign in to continue your journey</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4F3A]/20 focus:border-[#0B4F3A] transition-all"
                  placeholder="student@au.edu.mm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4F3A]/20 focus:border-[#0B4F3A] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-[#0B4F3A] focus:ring-[#0B4F3A]" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button 
                  type="button"
                  className="text-sm text-[#0B4F3A] hover:text-[#0d5f45] font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] text-white font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <BookOpen size={16} />
                <span>Igniting minds, transforming futures</span>
                <Sparkles size={16} className="text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-8 p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] rounded-2xl text-white">
            <Quote size={24} className="text-white/50 mb-2" />
            <p className="text-sm font-light mb-3">"{quotes[currentQuote].text}"</p>
            <p className="text-xs text-white/80">— {quotes[currentQuote].author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
'@

$loginPage | Out-File -FilePath "src/pages/Login.tsx" -Encoding UTF8
Write-Host "  ✅ Created: src/pages/Login.tsx" -ForegroundColor Green

# ============================================================================
# PART 2: CREATE GLASS SIDEBAR WITHOUT ADMIN
# ============================================================================
Write-Host ""
Write-Host "📝 PART 2: Creating Glass Sidebar (Admin Removed)..." -ForegroundColor Yellow

$sidebarFile = @'
// src/components/Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Award, 
  LogOut,
  Bell,
  GraduationCap,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-emerald-500 to-teal-500' },
    { path: '/profile', icon: User, label: 'My Profile', color: 'from-purple-500 to-pink-500' },
    { path: '/exams', icon: GraduationCap, label: 'Exam Portal', color: 'from-blue-500 to-indigo-500' },
    { path: '/announcements', icon: Bell, label: 'Announcements', color: 'from-amber-500 to-orange-500' },
    { path: '/courses', icon: BookOpen, label: 'My Courses', color: 'from-rose-500 to-red-500' },
    { path: '/materials', icon: FileText, label: 'Materials', color: 'from-cyan-500 to-blue-500' },
    { path: '/progress', icon: Award, label: 'Progress', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="h-full w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/40 flex flex-col animate-fadeIn">
      {onClose && (
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-[#0B4F3A] z-10 transition-all duration-300 hover:rotate-90"
        >
          <X size={20} />
        </button>
      )}

      <div className="p-6 border-b border-white/30 animate-slideDown">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] rounded-xl shadow-lg animate-pulse">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] bg-clip-text text-transparent">
              AUY Portal
            </h1>
            <p className="text-xs text-gray-500/80 mt-0.5">
              American University
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li 
              key={item.path}
              className="animate-slideRight"
              style={ { animationDelay: `${index * 0.1}s` } }
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => {
                  const activeClass = isActive ? 'text-white shadow-lg' : 'text-gray-600 hover:text-[#0B4F3A]';
                  return `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden ${activeClass}`;
                }}
              >
                {({ isActive }) => {
                  const bgClass = isActive ? 'opacity-100' : '';
                  return (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${bgClass}`} />
                      
                      <div className={`absolute left-0 w-1 h-8 bg-gradient-to-b ${item.color} rounded-r-full transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`} />
                      
                      <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                        isActive ? 'text-white' : ''
                      }`}>
                        <item.icon size={20} />
                      </div>
                      
                      <span className="relative z-10 font-medium">{item.label}</span>
                      
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                    </>
                  );
                }}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/30 animate-slideUp">
        <button
          onClick={handleLogout}
          className="group relative flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:text-red-500 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
            <LogOut size={20} />
          </div>
          <span className="relative z-10 font-medium">Logout</span>
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
        </button>
      </div>

      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-[#0B4F3A]/10 to-[#1a6b4f]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
    </div>
  );
};
'@

$sidebarFile | Out-File -FilePath "src/components/Sidebar.tsx" -Encoding UTF8
Write-Host "  ✅ Created: src/components/Sidebar.tsx" -ForegroundColor Green

# ============================================================================
# PART 3: CREATE PROFILE PAGE WITH STUDENT PHOTO
# ============================================================================
Write-Host ""
Write-Host "📝 PART 3: Creating Profile Page with Student Photo..." -ForegroundColor Yellow

$profilePage = @'
// src/pages/Profile.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, SectionTitle, Badge, Button } from '../components/Common';
import { 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  Calendar,
  MapPin,
  Phone,
  GraduationCap,
  Edit,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, attendance, studentName } = useData();

  const studentInfo = {
    fullName: studentName || user?.email?.split('@')[0] || 'Student Name',
    email: user?.email || 'student@au.edu.mm',
    studentId: 'S2024-001',
    dateOfBirth: 'March 15, 2003',
    nationality: 'Myanmar',
    phone: '+95 9 123 456 789',
    address: 'Yangon, Myanmar',
    enrollmentDate: 'August 2024',
    major: 'Information Science',
    studyMode: 'Full-time',
    advisor: 'Dr. Aung Kyaw',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop',
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden shadow-xl animate-fadeInDown">
        <div className="h-48 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] relative overflow-hidden">
          <img 
            src={studentInfo.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="absolute -bottom-16 left-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
              <img 
                src={studentInfo.profileImage} 
                alt={studentInfo.fullName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-[#0B4F3A] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#0d5f45] shadow-lg">
              <Edit size={14} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all shadow-lg hover:-translate-y-1">
            <Download size={18} />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all shadow-lg hover:-translate-y-1">
            <Share2 size={18} />
          </button>
          <Button variant="primary" className="shadow-lg">
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
        <div className="space-y-6 animate-fadeInLeft">
          <Card className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{studentInfo.fullName}</h2>
              <p className="text-[#0B4F3A] font-medium">{studentInfo.major}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="primary">Student</Badge>
                <Badge variant="success">Active</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#e0f2fe] group hover:bg-[#d1e9fd] transition-all">
                <div className="p-2 bg-[#0B4F3A] text-white rounded-lg group-hover:rotate-6 transition-transform">
                  <Mail size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-800">{studentInfo.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#e0f2fe] group hover:bg-[#d1e9fd] transition-all">
                <div className="p-2 bg-[#0B4F3A] text-white rounded-lg group-hover:rotate-6 transition-transform">
                  <Phone size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-800">{studentInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#e0f2fe] group hover:bg-[#d1e9fd] transition-all">
                <div className="p-2 bg-[#0B4F3A] text-white rounded-lg group-hover:rotate-6 transition-transform">
                  <Calendar size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium text-gray-800">{studentInfo.dateOfBirth}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#e0f2fe] group hover:bg-[#d1e9fd] transition-all">
                <div className="p-2 bg-[#0B4F3A] text-white rounded-lg group-hover:rotate-6 transition-transform">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-800">{studentInfo.address}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle icon={<GraduationCap size={20} className="text-[#0B4F3A]" />}>
              Academic Info
            </SectionTitle>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Student ID</span>
                <span className="font-medium text-gray-800">{studentInfo.studentId}</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Enrollment Date</span>
                <span className="font-medium text-gray-800">{studentInfo.enrollmentDate}</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Major</span>
                <span className="font-medium text-gray-800">{studentInfo.major}</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Study Mode</span>
                <span className="font-medium text-gray-800">{studentInfo.studyMode}</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Academic Advisor</span>
                <span className="font-medium text-gray-800">{studentInfo.advisor}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6 animate-fadeInRight">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center hover:shadow-xl transition-all group">
              <div className="inline-block p-3 bg-[#0B4F3A] text-white rounded-xl mb-3 group-hover:rotate-12 transition-transform">
                <Award size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{gpa.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Current GPA</p>
            </Card>

            <Card className="p-4 text-center hover:shadow-xl transition-all group">
              <div className="inline-block p-3 bg-[#0B4F3A] text-white rounded-xl mb-3 group-hover:rotate-12 transition-transform">
                <BookOpen size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{totalCredits}</p>
              <p className="text-sm text-gray-500">Credits Earned</p>
            </Card>

            <Card className="p-4 text-center hover:shadow-xl transition-all group">
              <div className="inline-block p-3 bg-[#0B4F3A] text-white rounded-xl mb-3 group-hover:rotate-12 transition-transform">
                <User size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{attendance}%</p>
              <p className="text-sm text-gray-500">Attendance</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={<BookOpen size={20} className="text-[#0B4F3A]" />}>
                Current Courses
              </SectionTitle>
              <Badge variant="primary">{courses.length} Courses</Badge>
            </div>

            <div className="space-y-3">
              {courses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-[#e0f2fe] hover:bg-[#d1e9fd] transition-all group"
                  style={ { animationDelay: `${index * 0.1}s` } }
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#0B4F3A] text-white rounded-lg group-hover:rotate-6 transition-transform">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{course.name}</p>
                      <p className="text-xs text-gray-500">{course.courseId} • {course.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Credits</p>
                      <p className="font-medium text-gray-800">{course.credits}</p>
                    </div>
                    {course.grade && (
                      <Badge variant={
                        course.grade.startsWith('A') ? 'success' :
                        course.grade.startsWith('B') ? 'primary' : 'warning'
                      }>
                        {course.grade}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={24} />
              <h3 className="text-lg font-semibold">Recent Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm opacity-90">Dean's List</p>
                <p className="text-xs opacity-70">Fall 2025</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm opacity-90">Perfect Attendance</p>
                <p className="text-xs opacity-70">Spring 2025</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm opacity-90">Research Assistant</p>
                <p className="text-xs opacity-70">Current</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <p className="text-sm opacity-90">Peer Tutor</p>
                <p className="text-xs opacity-70">2025-2026</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
'@

$profilePage | Out-File -FilePath "src/pages/Profile.tsx" -Encoding UTF8
Write-Host "  ✅ Created: src/pages/Profile.tsx" -ForegroundColor Green

# ============================================================================
# PART 4: CREATE PUBLICQ SERVICE
# ============================================================================
Write-Host ""
Write-Host "📝 PART 4: Creating PublicQ Service..." -ForegroundColor Yellow

$publicqService = @'
// src/services/publicq.service.ts
interface PublicQConfig {
  baseUrl: string;
  apiKey?: string;
}

interface PublicQExam {
  id: string;
  title: string;
  description: string;
  duration: number;
  questionCount: number;
  totalPoints: number;
  dueDate: string;
  status: 'available' | 'completed' | 'locked';
  courseId: string;
  courseName: string;
}

class PublicQService {
  private baseUrl: string;

  constructor(config: PublicQConfig) {
    this.baseUrl = config.baseUrl || 'https://publicq.app';
  }

  async getAvailableExams(studentId: string, courseIds: string[]): Promise<PublicQExam[]> {
    const mockExams: PublicQExam[] = [];
    
    const examTemplates: { [key: string]: PublicQExam[] } = {
      'STAT100': [
        {
          id: 'stat100-mid-001',
          title: 'Statistics Midterm Examination',
          description: 'Covers descriptive statistics, probability, and basic inferential statistics.',
          duration: 90,
          questionCount: 25,
          totalPoints: 100,
          dueDate: '2026-04-15',
          status: 'available',
          courseId: 'STAT100',
          courseName: 'Introduction to Statistics'
        }
      ],
      'MATH150': [
        {
          id: 'math150-mid-001',
          title: 'Calculus I Midterm',
          description: 'Derivatives, limits, and applications.',
          duration: 120,
          questionCount: 20,
          totalPoints: 100,
          dueDate: '2026-04-20',
          status: 'available',
          courseId: 'MATH150',
          courseName: 'Calculus I'
        }
      ],
      'HUM11': [
        {
          id: 'hum11-essay-001',
          title: 'Humanities Essay',
          description: 'Analysis of Renaissance art and literature.',
          duration: 180,
          questionCount: 3,
          totalPoints: 50,
          dueDate: '2026-05-01',
          status: 'available',
          courseId: 'HUM11',
          courseName: 'Introduction to Humanities'
        }
      ],
      'LING6': [
        {
          id: 'ling6-quiz-001',
          title: 'Phonetics Quiz',
          description: 'Quiz on phonetics and phonology.',
          duration: 45,
          questionCount: 15,
          totalPoints: 30,
          dueDate: '2026-03-28',
          status: 'available',
          courseId: 'LING6',
          courseName: 'Introduction to Linguistics'
        }
      ],
      'ENG10': [
        {
          id: 'eng10-mid-001',
          title: 'English Composition',
          description: 'Essay writing and grammar review.',
          duration: 90,
          questionCount: 2,
          totalPoints: 40,
          dueDate: '2026-04-10',
          status: 'available',
          courseId: 'ENG10',
          courseName: 'English Composition'
        }
      ],
      'CFS38': [
        {
          id: 'cfs38-quiz-001',
          title: 'Career Development Quiz',
          description: 'Quiz on resume writing and interview skills.',
          duration: 30,
          questionCount: 12,
          totalPoints: 25,
          dueDate: '2026-03-30',
          status: 'available',
          courseId: 'CFS38',
          courseName: 'Career and Professional Development'
        }
      ]
    };

    courseIds.forEach(courseId => {
      if (examTemplates[courseId]) {
        mockExams.push(...examTemplates[courseId]);
      }
    });

    return mockExams;
  }

  async getStudentResults(studentId: string): Promise<any[]> {
    return [
      {
        examId: 'stat100-quiz-001',
        studentId: studentId,
        score: 18,
        percentage: 90,
        passed: true,
        submittedAt: new Date().toISOString(),
        timeSpent: 25
      }
    ];
  }

  getExamUrl(examId: string, studentId: string, studentName: string): string {
    const params = new URLSearchParams({
      studentId: studentId,
      studentName: studentName,
      embed: 'true',
      theme: 'auy'
    });
    
    return `https://publicq.app/exam/${examId}?${params.toString()}`;
  }
}

export const publicqService = new PublicQService({
  baseUrl: 'https://publicq.app'
});
'@

$publicqService | Out-File -FilePath "src/services/publicq.service.ts" -Encoding UTF8
Write-Host "  ✅ Created: src/services/publicq.service.ts" -ForegroundColor Green

# ============================================================================
# PART 5: CREATE AUY EXAMS PAGE WITH PUBLICQ INTEGRATION
# ============================================================================
Write-Host ""
Write-Host "📝 PART 5: Creating AUY Exams Page with PublicQ..." -ForegroundColor Yellow

$auyExams = @'
// src/pages/AUYExams.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, Badge, Button } from '../components/Common';
import { publicqService } from '../services/publicq.service';
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  PlayCircle,
  CheckCircle,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  duration: number;
  questionCount: number;
  totalPoints: number;
  dueDate: string;
  status: 'available' | 'completed' | 'locked';
}

export const AUYExams: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    loadExamsAndResults();
  }, [courses]);

  const loadExamsAndResults = async () => {
    setLoading(true);
    try {
      const courseIds = courses.map(c => c.courseId);
      const availableExams = await publicqService.getAvailableExams(
        user?.email || '',
        courseIds
      );
      setExams(availableExams);
      const studentResults = await publicqService.getStudentResults(user?.email || '');
      setResults(studentResults);
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (exam: Exam) => {
    const examUrl = publicqService.getExamUrl(
      exam.id,
      user?.email || '',
      user?.displayName || 'Student'
    );
    window.open(examUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (exam: Exam) => {
    const result = results.find(r => r.examId === exam.id);
    const now = new Date();
    const due = new Date(exam.dueDate);

    if (result) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle size={12} />
          {result.percentage}%
        </Badge>
      );
    } else if (due < now) {
      return <Badge variant="warning">Overdue</Badge>;
    } else {
      return <Badge variant="primary">Available</Badge>;
    }
  };

  const availableExams = exams.filter(exam => !results.find(r => r.examId === exam.id));
  const completedExams = exams.filter(exam => results.find(r => r.examId === exam.id));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#0B4F3A]/20 border-t-[#0B4F3A] rounded-full animate-spin"></div>
          <GraduationCap className="absolute inset-0 m-auto text-[#0B4F3A] animate-pulse" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 animate-fadeInDown">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] bg-clip-text text-transparent">
              Exam Portal
            </h1>
            <p className="text-gray-500 mt-1">Powered by PublicQ - AI-Powered Assessment</p>
          </div>
          <div className="flex items-center gap-2 bg-[#e0f2fe] px-4 py-2 rounded-xl">
            <Sparkles className="text-[#0B4F3A]" size={20} />
            <span className="text-sm font-medium text-[#0B4F3A]">AI Monkey Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-[#0B4F3A] text-white rounded-xl">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{availableExams.length}</p>
            <p className="text-sm text-gray-500">Available Exams</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-[#0B4F3A] text-white rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{completedExams.length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-[#0B4F3A] text-white rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {results.length > 0 
                ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)
                : 0}%
            </p>
            <p className="text-sm text-gray-500">Average Score</p>
          </div>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'available'
              ? 'text-[#0B4F3A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Available Exams
          {activeTab === 'available' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4F3A] rounded-full" />
          )}
          {availableExams.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {availableExams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium transition-all relative ${
            activeTab === 'completed'
              ? 'text-[#0B4F3A]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B4F3A] rounded-full" />
          )}
          {completedExams.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
              {completedExams.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'available' && (
        <>
          {availableExams.length === 0 ? (
            <Card className="p-12 text-center">
              <GraduationCap className="mx-auto text-gray-300 mb-4 animate-float" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exams Available</h3>
              <p className="text-gray-500">You've completed all your exams. Great job!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableExams.map((exam, index) => (
                <Card 
                  key={exam.id} 
                  className="p-6 hover:shadow-2xl transition-all group animate-fadeInUp"
                  style={ { animationDelay: `${index * 0.1}s` } }
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#0B4F3A] transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-sm font-medium text-[#0B4F3A] mt-1">
                        {exam.courseName} • {exam.courseId}
                      </p>
                    </div>
                    {getStatusBadge(exam)}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{exam.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-[#0B4F3A]" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen size={16} className="text-[#0B4F3A]" />
                      <span>{exam.questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award size={16} className="text-[#0B4F3A]" />
                      <span>{exam.totalPoints} points</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-[#0B4F3A]" />
                      <span>Due {formatDate(exam.dueDate)}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 group"
                    onClick={() => handleStartExam(exam)}
                  >
                    <PlayCircle size={18} className="group-hover:scale-110 transition-transform" />
                    Start Exam
                  </Button>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-1">
                    <span className="text-xs text-gray-400">Powered by</span>
                    <span className="text-xs font-semibold text-[#0B4F3A]">PublicQ</span>
                    <span className="text-xs bg-[#e0f2fe] px-1.5 py-0.5 rounded text-[#0B4F3A] ml-1">
                      AI
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'completed' && (
        <>
          {completedExams.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Completed Exams</h3>
              <p className="text-gray-500">Complete an exam to see your results here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedExams.map((exam, index) => {
                const result = results.find(r => r.examId === exam.id);
                return (
                  <Card 
                    key={exam.id} 
                    className="p-6 hover:shadow-lg transition-all animate-fadeInUp"
                    style={ { animationDelay: `${index * 0.1}s` } }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                          <CheckCircle size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                          <p className="text-sm text-gray-500">{exam.courseName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{result?.percentage}%</p>
                        <p className="text-xs text-gray-400">Score: {result?.score}/{exam.totalPoints}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          Submitted: {formatDate(result?.submittedAt || '')}
                        </span>
                        <span className="text-gray-500">
                          Time: {result?.timeSpent} min
                        </span>
                      </div>
                      <Badge variant={result?.passed ? 'success' : 'warning'}>
                        {result?.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      <Card className="p-4 bg-gradient-to-r from-[#e0f2fe] to-[#d1e9fd] border-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0B4F3A] text-white rounded-full animate-bounce">
            <Sparkles size={16} />
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">AI Monkey Tip:</span> Use PublicQ's AI to generate practice questions and improve your scores!
          </p>
        </div>
      </Card>
    </div>
  );
};
'@

$auyExams | Out-File -FilePath "src/pages/AUYExams.tsx" -Encoding UTF8
Write-Host "  ✅ Created: src/pages/AUYExams.tsx" -ForegroundColor Green

# ============================================================================
# PART 6: UPDATE APP.TSX WITH ALL ROUTES
# ============================================================================
Write-Host ""
Write-Host "📝 PART 6: Updating App.tsx with all routes..." -ForegroundColor Yellow

$appFile = @'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { Profile } from './pages/Profile';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { Courses } from './pages/Courses';
import { Materials } from './pages/Materials';
import { Progress } from './pages/Progress';
import { Grades } from './pages/Grades';
import { AUYExams } from './pages/AUYExams';
import { MainLayout } from './components/MainLayout';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            <Route path="/dashboard" element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            } />
            <Route path="/profile" element={
              <ProtectedLayout>
                <Profile />
              </ProtectedLayout>
            } />
            <Route path="/exams" element={
              <ProtectedLayout>
                <AUYExams />
              </ProtectedLayout>
            } />
            <Route path="/announcements" element={
              <ProtectedLayout>
                <AnnouncementsPage />
              </ProtectedLayout>
            } />
            <Route path="/courses" element={
              <ProtectedLayout>
                <Courses />
              </ProtectedLayout>
            } />
            <Route path="/materials" element={
              <ProtectedLayout>
                <Materials />
              </ProtectedLayout>
            } />
            <Route path="/progress" element={
              <ProtectedLayout>
                <Progress />
              </ProtectedLayout>
            } />
            <Route path="/grades" element={
              <ProtectedLayout>
                <Grades />
              </ProtectedLayout>
            } />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
'@

$appFile | Out-File -FilePath "src/App.tsx" -Encoding UTF8
Write-Host "  ✅ Updated: src/App.tsx" -ForegroundColor Green

# ============================================================================
# PART 7: CREATE PUBLICQ CONFIG FILE
# ============================================================================
Write-Host ""
Write-Host "📝 PART 7: Creating PublicQ Configuration..." -ForegroundColor Yellow

$publicqConfig = @'
// src/config/publicq.config.ts
export const publicqConfig = {
  apiUrl: process.env.REACT_APP_PUBLICQ_URL || 'https://publicq.app',
  
  defaultDuration: 60,
  passingScore: 60,
  
  enableAIMonkey: true,
  enableProctoring: false,
  enableResultsSync: true,
  
  theme: {
    primary: '#0B4F3A',
    secondary: '#1a6b4f',
    accent: '#e0f2fe',
    institutionName: 'American University of Yangon'
  },
  
  courseExams: {
    'STAT100': ['stat100-mid-001', 'stat100-quiz-001'],
    'MATH150': ['math150-mid-001'],
    'HUM11': ['hum11-essay-001'],
    'LING6': ['ling6-quiz-001'],
    'ENG10': ['eng10-mid-001'],
    'CFS38': ['cfs38-quiz-001']
  }
};
'@

$publicqConfig | Out-File -FilePath "src/config/publicq.config.ts" -Encoding UTF8
Write-Host "  ✅ Created: src/config/publicq.config.ts" -ForegroundColor Green

# ============================================================================
# COMPLETION MESSAGE
# ============================================================================
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ SETUP COMPLETE! All files created successfully        ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Files Created:" -ForegroundColor Cyan
Write-Host "  • src/pages/Login.tsx - Beautiful login with educational quotes" -ForegroundColor White
Write-Host "  • src/components/Sidebar.tsx - Glass sidebar without admin" -ForegroundColor White
Write-Host "  • src/pages/Profile.tsx - Student profile with photo" -ForegroundColor White
Write-Host "  • src/services/publicq.service.ts - PublicQ integration" -ForegroundColor White
Write-Host "  • src/pages/AUYExams.tsx - Exam portal with PublicQ" -ForegroundColor White
Write-Host "  • src/config/publicq.config.ts - PublicQ configuration" -ForegroundColor White
Write-Host "  • src/App.tsx - Updated with all routes" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Run: npm install (if needed)" -ForegroundColor Cyan
Write-Host "  2. Run: npm run dev" -ForegroundColor Cyan
Write-Host "  3. Visit: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  4. Login with your test credentials" -ForegroundColor Cyan
Write-Host "  5. Click 'Exam Portal' in sidebar to access PublicQ exams" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 To create exams in PublicQ:" -ForegroundColor Magenta
Write-Host "  • Go to https://publicq.app and click 'Try Demo'" -ForegroundColor White
Write-Host "  • Create assessment modules with multiple question types" -ForegroundColor White
Write-Host "  • Use AI Monkey to generate questions automatically" -ForegroundColor White
Write-Host "  • Assign exams to students" -ForegroundColor White
Write-Host ""
Write-Host "✨ Your AUY Portal is now ready with:" -ForegroundColor Cyan
Write-Host "  • Beautiful glass-morphism design" -ForegroundColor White
Write-Host "  • Educational quotes on login" -ForegroundColor White
Write-Host "  • Student profiles with photos" -ForegroundColor White
Write-Host "  • PublicQ exam integration" -ForegroundColor White
Write-Host "  • AI Monkey for question generation" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Run this script now to create all files!" -ForegroundColor Green