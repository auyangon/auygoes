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

  // Sample student data (in a real app, this would come from your backend)
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
      {/* Cover Photo and Profile Header */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl animate-fadeInDown">
        <div className="h-48 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] relative overflow-hidden">
          <img 
            src={studentInfo.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Profile Picture */}
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

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all shadow-lg hover:-translate-y-1">
            <Download size={18} />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-all shadow-lg hover:-translate-y-1">
            <Share2 size={18} />
          </button>
          <Button variant="primary" size="sm" className="shadow-lg">
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Info and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
        {/* Left Column - Personal Info */}
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

        {/* Right Column - Stats and Courses */}
        <div className="lg:col-span-2 space-y-6 animate-fadeInRight">
          {/* Stats Cards */}
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

          {/* Current Courses */}
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
                  style={{ animationDelay: `${index * 0.1}s` }}
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

          {/* Achievements */}
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
