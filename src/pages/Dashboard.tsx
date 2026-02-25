import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { GlassCard } from '../components/Common';
import { 
  LayoutDashboard, 
  Mail, 
  Briefcase, 
  CheckSquare, 
  Users, 
  CreditCard, 
  Calendar, 
  CheckCircle,
  Bell,
  Star,
  TrendingUp,
  Clock,
  FileText,
  Cloud,
  DollarSign,
  Award,
  Menu
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { studentName, gpa, totalCredits, attendance, courses } = useData();

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Mail size={20} />, label: 'Email', badge: 3 },
    { icon: <Briefcase size={20} />, label: 'Projects' },
    { icon: <CheckSquare size={20} />, label: 'Tasks' },
    { icon: <Users size={20} />, label: 'Teams' },
    { icon: <CreditCard size={20} />, label: 'Payments' },
    { icon: <Calendar size={20} />, label: 'Upcoming' },
    { icon: <CheckCircle size={20} />, label: 'Done' },
  ];

  const updates = [
    { label: 'Brand addition', color: 'bg-emerald-400' },
    { label: 'Upcoming tasks', color: 'bg-blue-400' },
  ];

  const projects = [
    { name: 'Starbucks', category: 'Fast Industry', color: 'bg-emerald-500' },
    { name: 'Instagram', category: 'Tech Business', color: 'bg-blue-500' },
    { name: 'Bunch app', category: 'IT Business', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 h-screen sticky top-0 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg"></div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              databerry™
            </span>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-1">Dave Johnson</p>
            <p className="text-xs text-gray-500">Founder and CEO</p>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-light text-gray-400">Hello {studentName?.split(' ')[0] || 'Dave'},</h1>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome back
              </h2>
              <p className="text-sm text-gray-400 mt-1">Your Dashboard is updated</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition">
                <Bell size={20} className="text-gray-400" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Updates and Projects */}
            <div className="col-span-2 space-y-6">
              {/* Latest Updates */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-lg font-semibold mb-4">Latest updates</h3>
                <div className="flex gap-4">
                  {updates.map((update, index) => (
                    <div key={index} className="flex-1">
                      <div className={`h-2 w-full ${update.color} rounded-full mb-2`}></div>
                      <p className="text-sm text-gray-400">{update.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition">
                    <div className={`w-10 h-10 ${project.color} rounded-lg mb-3`}></div>
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-gray-400">{project.category}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Updated 2h ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Stats and Weather */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-emerald-400">PRIMARY: REGULAR</span>
                  <Star size={16} className="text-yellow-500" />
                </div>
                
                <div className="mb-4">
                  <h4 className="text-2xl font-bold">Open projects</h4>
                  <p className="text-sm text-gray-400">{totalCredits * 3} tasks remaining</p>
                </div>

                <div className="h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: `${(gpa / 4) * 100}%` }}></div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition">
                  Complete tasks
                </button>
              </div>

              {/* Urgent To Do */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Clock size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Urgent to do</h4>
                    <p className="text-sm text-gray-400">{courses.length} active courses</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Current GPA: {gpa.toFixed(2)}</p>
              </div>

              {/* Weather */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-3xl p-6">
                <p className="text-sm text-gray-400 mb-2">What's your plan?</p>
                <p className="text-xs text-gray-500 mb-4">Looks like a productive day</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-light">{attendance}°</span>
                  <Cloud size={30} className="text-gray-400 mb-1" />
                </div>
              </div>

              {/* Savings */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign size={24} className="text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-400">Great Job, You Saved</p>
                    <p className="text-2xl font-bold">${totalCredits * 500}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-yellow-500" />
                  <p className="text-sm text-gray-400">Points Earned : {Math.round(gpa * 2500)}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};