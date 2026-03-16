import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { type PageKey } from './Sidebar';
import Topbar from './Topbar';
import Dashboard from '../pages/Dashboard';
import Courses from '../pages/Courses';
import Materials from '../pages/Materials';
import Schedule from '../pages/Schedule';
import Announcements from '../pages/Announcements';
import Attendance from '../pages/Attendance';

const PAGE_COMPONENTS: Record<PageKey, React.ComponentType> = {
  dashboard:     Dashboard,
  courses:       Courses,
  materials:     Materials,
  schedule:      Schedule,
  attendance:    Attendance,
  announcements: Announcements,
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export default function Portal() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = PAGE_COMPONENTS[activePage];

  return (
    <div className="min-h-screen hero-bg flex">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'rgba(196,181,253,0.18)' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(251,207,232,0.20)' }} />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'rgba(167,243,208,0.12)' }} />
      </div>

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
