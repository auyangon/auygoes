import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Home, User, BookOpen, Calendar, LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-[#0B4F3A]" size={28} />
              <span className="text-xl font-semibold text-[#0B4F3A]">AUY Portal</span>
            </div>
            
            <nav className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-[#0B4F3A] rounded-lg hover:bg-gray-50"
              >
                <Home size={20} />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-600 hover:text-[#0B4F3A] rounded-lg hover:bg-gray-50"
              >
                <User size={20} />
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="p-2 text-gray-600 hover:text-[#0B4F3A] rounded-lg hover:bg-gray-50"
              >
                <BookOpen size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-50"
              >
                <LogOut size={20} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
