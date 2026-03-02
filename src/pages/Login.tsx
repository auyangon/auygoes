import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn, Sparkles, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setShowForgot(false);
      setResetSent(false);
      setResetEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B4F3A] via-[#1a6b4f] to-[#2E8B57] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-2xl mb-4 border border-white/20 shadow-2xl">
            <GraduationCap size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-light text-white mb-2 tracking-tight">AUY Portal</h1>
          <p className="text-white/70 text-sm">American University of Yangon</p>
        </div>

        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {!showForgot ? (
            <>
              {/* Login Form */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-white mb-2">Welcome Back</h2>
                <p className="text-white/50 text-sm">Sign in to continue your journey</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-light text-white/80 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                      placeholder="student@au.edu.mm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-light text-white/80 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link - VISIBLE and PROMINENT */}
                <div className="flex items-center justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <KeyRound size={14} className="group-hover:rotate-12 transition-transform" />
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white text-[#0B4F3A] font-medium rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#0B4F3A] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/40 text-xs flex items-center justify-center gap-2">
                  <Sparkles size={12} />
                  Secure portal • 256-bit encryption
                  <Sparkles size={12} />
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-white/10 rounded-full mb-4">
                  <KeyRound size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-light text-white mb-2">Reset Password</h2>
                <p className="text-white/50 text-sm">Enter your email to receive reset instructions</p>
              </div>

              {resetSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Mail className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-xl font-light text-white mb-2">Check Your Email</h3>
                  <p className="text-white/50 text-sm mb-6">
                    Reset link sent to {resetEmail}
                  </p>
                  <button
                    onClick={() => setShowForgot(false)}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    ← Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-light text-white/80 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={18} />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
                        placeholder="student@au.edu.mm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-white text-[#0B4F3A] font-medium rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mt-6"
                  >
                    Send Reset Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="w-full text-white/70 hover:text-white transition-colors text-sm mt-2"
                  >
                    ← Back to Login
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/30 text-xs">
            © 2026 American University of Yangon. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
