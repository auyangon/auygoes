import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/Common';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-md w-full">
        <h1 className="text-3xl font-normal text-jet mb-2 text-center">AUY Portal</h1>
        <p className="text-jet/70 text-center mb-8">American University of Yangon</p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-white/10 hover:bg-white/20 text-jet font-normal py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </GlassCard>
    </div>
  );
};

