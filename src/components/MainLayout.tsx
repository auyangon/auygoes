import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-lg text-jet"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar overlay */}
      <div
        className={
          fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity lg:hidden
          
        }
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={
          fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:translate-x-0
          
        }
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="lg:pl-56 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};
