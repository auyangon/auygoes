import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Common';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Sparkles className="text-seafoam-dark" size={40} />
          </div>
          <h1 className="text-3xl font-normal text-jet mb-2">Welcome Back!</h1>
          <p className="text-jet/70">Sign in to your student portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-jet/70 text-sm mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet/40" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-seafoam-soft/30 rounded-xl py-3 pl-10 pr-4 text-jet placeholder-jet/40 focus:outline-none focus:ring-2 focus:ring-seafoam-dark/20"
                placeholder="student@au.edu.mm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-jet/70 text-sm mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet/40" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border border-seafoam-soft/30 rounded-xl py-3 pl-10 pr-4 text-jet placeholder-jet/40 focus:outline-none focus:ring-2 focus:ring-seafoam-dark/20"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-jet/60 hover:text-jet transition">
              Aiyo, forget password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-seafoam-dark hover:bg-seafoam-medium text-white font-normal py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

        <p className="text-center text-jet/50 text-sm mt-6">
          Don't have an account? Contact your administrator.
        </p>
      </Card>
    </div>
  );
};


