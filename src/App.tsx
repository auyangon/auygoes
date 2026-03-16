import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './pages/LoginPage';
import Portal from './components/Portal';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <DataProvider>
            <Portal />
          </DataProvider>
        ) : (
          <LoginPage />
        )}
      </AnimatePresence>
      <Toaster
        position="top-right"
        containerStyle={{ top: 20, right: 16 }}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(255,255,255,0.95)',
            color: '#1a2e2a',
            border: '1px solid rgba(20,184,166,0.20)',
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: '0 8px 32px rgba(20,184,166,0.14)',
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
