import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Common';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('✅ Check your email for the reset link!');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        {/* Fun header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Sparkles className="text-seafoam-dark" size={40} />
          </div>
          <h1 className="text-3xl font-normal text-jet mb-2" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.12)' }}>Aiyo, forget password?</h1>
          <p className="text-jet/70">Don't worry, we all have those moments! 😊</p>
          <p className="text-sm text-jet/50 mt-1">Enter your email and we'll send you a reset link.</p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-seafoam-soft/50 border border-seafoam-soft rounded-lg text-jet text-sm">
            {message}
          </div>
        )}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-seafoam-dark hover:bg-seafoam-medium text-white font-normal py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-jet/60 hover:text-jet transition">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};


