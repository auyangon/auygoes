import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/Common';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <GlassCard className="p-8 max-w-md w-full">
        <h1 className="text-3xl font-light text-white mb-2 text-center">AUY Student Portal</h1>
        <p className="text-white/70 text-center mb-8">Sign in with your email</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-white/40 text-xs text-center mt-6">
          Use your university email and password
        </p>
      </GlassCard>
    </div>
  );
}