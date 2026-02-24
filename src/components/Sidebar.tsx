import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, FileText, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Courses', to: '/courses', icon: BookOpen },
  { name: 'Grades', to: '/grades', icon: GraduationCap },
  { name: 'Materials', to: '/materials', icon: FileText },
  { name: 'Progress', to: '/progress', icon: TrendingUp },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white/90">AUY Portal</h1>
        <p className="text-xs text-white/40 mt-1">Student Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition',
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition mt-auto"
      >
        <LogOut size={20} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  );
}