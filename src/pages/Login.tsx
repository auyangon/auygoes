// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, Quote, ChevronRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Educational quotes array
  const quotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Education is not preparation for life; education is life itself.",
      author: "John Dewey"
    },
    {
      text: "The roots of education are bitter, but the fruit is sweet.",
      author: "Aristotle"
    },
    {
      text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi"
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss"
    },
    {
      text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
      author: "Malcolm X"
    },
    {
      text: "The purpose of education is to replace an empty mind with an open one.",
      author: "Malcolm Forbes"
    },
    {
      text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.",
      author: "Abigail Adams"
    },
    {
      text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
      author: "Brian Herbert"
    }
  ];

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#faf7f2' }}>
      {/* Left Side - Quote & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] text-white p-12 flex-col justify-between">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* Logo and Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <GraduationCap size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AUY Portal</h1>
              <p className="text-white/70 text-sm">American University of Yangon</p>
            </div>
          </div>

          {/* Quote Display */}
          <div className="mt-16 relative">
            <Quote className="absolute -top-6 -left-6 text-white/20" size={48} />
            <div className="relative z-10">
              <p className="text-2xl font-light leading-relaxed mb-6">
                "{quotes[currentQuote].text}"
              </p>
              <p className="text-white/80 text-lg">
                — {quotes[currentQuote].author}
              </p>
            </div>
            
            {/* Quote dots indicator */}
            <div className="flex gap-2 mt-8">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentQuote 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/60 text-sm">
          <p>© 2026 American University of Yangon. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] rounded-2xl mb-4">
              <GraduationCap size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#0B4F3A]">AUY Portal</h1>
            <p className="text-gray-500">American University of Yangon</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Please sign in to continue your journey</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4F3A]/20 focus:border-[#0B4F3A] transition-all"
                  placeholder="student@au.edu.mm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4F3A]/20 focus:border-[#0B4F3A] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-[#0B4F3A] focus:ring-[#0B4F3A]" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button 
                  type="button"
                  className="text-sm text-[#0B4F3A] hover:text-[#0d5f45] font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0B4F3A] to-[#1a6b4f] text-white font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Decorative elements */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <BookOpen size={16} />
                <span>Igniting minds, transforming futures</span>
                <Sparkles size={16} className="text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Mobile Quote (visible only on mobile) */}
          <div className="lg:hidden mt-8 p-6 bg-gradient-to-br from-[#0B4F3A] to-[#1a6b4f] rounded-2xl text-white">
            <Quote size={24} className="text-white/50 mb-2" />
            <p className="text-sm font-light mb-3">"{quotes[currentQuote].text}"</p>
            <p className="text-xs text-white/80">— {quotes[currentQuote].author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
