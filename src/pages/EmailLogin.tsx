import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Common';
import { Mail, Lock, LogIn } from 'lucide-react';

export const EmailLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal text-jet mb-2" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>AUY Portal</h1>
          <p className="text-jet/70">American University of Yangon</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-jet/70 text-sm mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet/70" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-jet placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="student@auy.edu.mm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-jet/70 text-sm mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet/70" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-jet placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-jet font-normal py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-jet/70 text-xs text-center mt-6">
          Use your AUY email and password
        </p>
      </Card>
    </div>
  );
};


