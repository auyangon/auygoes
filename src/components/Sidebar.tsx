import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, Briefcase, CheckSquare, Users, CreditCard, Calendar, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Email', to: '/email', icon: Mail, badge: 3 },
  { name: 'Projects', to: '/projects', icon: Briefcase },
  { name: 'Tasks', to: '/tasks', icon: CheckSquare },
  { name: 'Teams', to: '/teams', icon: Users },
  { name: 'Payments', to: '/payments', icon: CreditCard },
  { name: 'Upcoming', to: '/upcoming', icon: Calendar },
  { name: 'Done', to: '/done', icon: CheckCircle },
];

export const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { logout, user } = useAuth();

  return (
    <aside className="h-full w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"></div>
        <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          databerry™
        </span>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-1">{user?.displayName || 'Dave Johnson'}</p>
        <p className="text-xs text-gray-500">Student</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon size={20} />
              <span className="flex-1 text-sm">{item.name}</span>
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition mt-auto"
      >
        <LogOut size={20} />
        <span className="text-sm">Logout</span>
      </button>
    </aside>
  );
};