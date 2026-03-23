import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { HiOutlineAcademicCap, HiOutlineSparkles } from 'react-icons/hi';
import { useStudent } from '../context/StudentContext';
import { decodeGoogleCredential } from '../services/googleAuth';

const QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" }
];

const getQuoteOfTheDay = () => {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
};

export function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { loginWithGoogle } = useStudent();
  const quote = getQuoteOfTheDay();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = () => currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsLoading(true);
      try {
        const user = decodeGoogleCredential(credentialResponse.credential);
        if (user?.email) {
          const success = await loginWithGoogle(user.email);
          if (!success) setError('Email not found in AUY system');
        }
      } catch {
        setError('Google login failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #0a2e28 0%, #1b5f56 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Quote */}
          <div className="hidden md:block p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <h2 className="text-3xl font-bold text-white">AUY</h2>
            <p className="text-white/70 mt-2">American University of Yangon</p>
            <div className="mt-8">
              <p className="text-white/90 text-xl italic">"{quote.text}"</p>
              <p className="text-white/60 mt-2">— {quote.author}</p>
            </div>
          </div>

          {/* Right - Google Login */}
          <div className="bg-white rounded-2xl p-8">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-2xl mb-4" style={{ background: '#1b5f56' }}>
                <HiOutlineAcademicCap size={40} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: '#0d312c' }}>Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1">{formatDate()} • {formatTime()}</p>
            </div>

            <div className="mt-8 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Login failed')}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            {isLoading && <p className="text-center mt-4 text-gray-500">Logging in...</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
