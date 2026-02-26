import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2' }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-700 border border-pastel-peach"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar overlay for mobile – THIS LINE WAS THE PROBLEM */}
      <div
        className={ixed inset-0 bg-black bg-opacity-10 z-40 transition-opacity lg:hidden }
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={ixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:translate-x-0 }
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
