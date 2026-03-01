import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { MainLayout } from '../components/MainLayout';
import { Card, SectionTitle, Badge, Button, Avatar, ProgressBar } from '../components/Common';
import {
  User,
  Mail,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Phone,
  GraduationCap,
  Edit2,
  Camera,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Random fun greetings
const greetings = [
  "Hey superstar! ✨",
  "Welcome back, champ! 🏆",
  "Great to see you! 🌟",
  "Ready to rock? 🎸",
  "Let's make today awesome! 🚀",
  "You're doing amazing! 💪",
  "Another day, another win! 🎯",
  "Time to shine! ☀️",
];

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { courses, gpa, totalCredits, attendance, studentName, studentEmail, major } = useData();
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  // Placeholder image – you can replace with real user photo
  const profileImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop";
  const coverImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop";

  return (
    <MainLayout>
      {/* Fun welcome banner */}
      <div className="mb-8 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
        <Sparkles className="text-yellow-300" size={28} />
        <h1 className="text-3xl font-light text-white" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>{greeting} {studentName || 'Student'}!</h1>
      </div>

      {/* Cover & Avatar */}
      <div className="relative mb-20">
        <div className="h-48 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="absolute -bottom-12 left-8">
          <Avatar src={profileImage} alt={studentName} size="lg" />
          <button className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white hover:bg-white/30 transition">
            <Camera size={16} />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button variant="secondary" size="sm" className="flex items-center gap-1">
            <Edit2 size={14} />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Info & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column – Personal Info */}
        <Card className="p-6 space-y-4">
          <SectionTitle icon={<User size={18} />}>Personal Info</SectionTitle>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Mail size={16} className="text-white/70" />
              <span className="text-sm text-white/90">{studentEmail}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <GraduationCap size={16} className="text-white/70" />
              <span className="text-sm text-white/90">{major || 'ISP Program'}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Calendar size={16} className="text-white/70" />
              <span className="text-sm text-white/90">Joined Aug 2024</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <MapPin size={16} className="text-white/70" />
              <span className="text-sm text-white/90">Yangon, Myanmar</span>
            </div>
          </div>
        </Card>

        {/* Middle column – Academic Stats */}
        <Card className="p-6 space-y-4">
          <SectionTitle icon={<Award size={18} />}>Academic Stats</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-light text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{gpa.toFixed(2)}</div>
              <div className="text-xs text-white/60">GPA</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-light text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{totalCredits}</div>
              <div className="text-xs text-white/60">Credits</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-light text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{courses.length}</div>
              <div className="text-xs text-white/60">Courses</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm text-center">
              <div className="text-2xl font-light text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>{attendance}%</div>
              <div className="text-xs text-white/60">Attendance</div>
            </div>
          </div>
          <div className="pt-4 border-t border-white/20">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Degree Progress</span>
              <span>{totalCredits} / 120</span>
            </div>
            <ProgressBar value={(totalCredits / 120) * 100} />
          </div>
        </Card>

        {/* Right column – Current Courses */}
        <Card className="p-6 space-y-4">
          <SectionTitle icon={<BookOpen size={18} />}>Current Courses</SectionTitle>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {courses.slice(0, 5).map(course => (
              <div key={course.id} className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-light text-white">{course.name}</span>
                  <Badge variant="primary" className="text-xs">{course.courseId}</Badge>
                </div>
                <div className="flex justify-between text-xs text-white/60">
                  <span>{course.teacher}</span>
                  <span>Grade: {course.grade || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card className="p-6 mt-6">
        <SectionTitle icon={<TrendingUp size={18} />}>Attendance Overview</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {courses.slice(0, 3).map(course => (
              <div key={course.id} className="flex items-center gap-3">
                <div className="w-24 text-sm text-white/80">{course.courseId}</div>
                <div className="flex-1">
                  <ProgressBar value={course.attendancePercentage || 0} />
                </div>
                <span className="text-sm text-white/90 w-12 text-right">{course.attendancePercentage}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <CheckCircle className="mx-auto text-green-400 mb-1" size={24} />
              <div className="text-sm text-white/90">Present</div>
            </div>
            <div className="text-center">
              <Clock className="mx-auto text-yellow-400 mb-1" size={24} />
              <div className="text-sm text-white/90">Late</div>
            </div>
            <div className="text-center">
              <XCircle className="mx-auto text-red-400 mb-1" size={24} />
              <div className="text-sm text-white/90">Absent</div>
            </div>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

