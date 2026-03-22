import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { HiOutlineAcademicCap, HiOutlineSparkles, HiOutlineBookOpen } from 'react-icons/hi';
import { useStudent } from '../context/StudentContext';
import { decodeGoogleCredential } from '../services/googleAuth';

// AUY Colors - Blue & White Theme
const AUY_BLUE = "#1a3e6f";
const AUY_GOLD = "#c4a15b";

const QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Education is the passport to the future.", author: "Malcolm X" }
];

const getQuoteOfTheDay = () => {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
};

export function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { loginWithGoogle } = useStudent();
  
  const quote = getQuoteOfTheDay();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsLoading(true);
      try {
        const user = decodeGoogleCredential(credentialResponse.credential);
        if (user?.email) {
          const success = await loginWithGoogle(user.email);
          if (!success) setError('Email not found. Please use your AUY email.');
        }
      } catch (err) {
        setError('Google login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #1a3e6f 0%, #0e2a4a 100%)' }}>
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-20 animate-pulse" 
             style={{ background: 'radial-gradient(circle, #c4a15b 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-20 animate-pulse delay-1000"
             style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left - Quote */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block">
            <div className="p-10 rounded-3xl" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <div className="mb-8">
                <h2 className="text-5xl font-bold text-white mb-2">AUY</h2>
                <p className="text-white/70 text-lg">American University of Yangon</p>
              </div>
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl text-white/30">"</div>
                  <p className="text-white/90 text-xl italic leading-relaxed">{quote.text}</p>
                  <div className="text-6xl text-white/30 self-end">"</div>
                </div>
                <p className="text-white/60 text-right">— {quote.author}</p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <HiOutlineSparkles className="text-yellow-300" />
                <span className="text-white/90 text-sm">Quote of the Day</span>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-white/60 text-sm">Students</p>
                </div>
                <div className="text-center p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-2xl font-bold text-white">50+</p>
                  <p className="text-white/60 text-sm">Faculty</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Google Login Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-3xl mb-4" style={{ background: AUY_BLUE }}>
                  <HiOutlineAcademicCap size={48} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: AUY_BLUE }}>{getGreeting()}!</h1>
                <p className="text-gray-500 text-sm">{formatDate()}</p>
              </div>

              <div className="flex flex-col items-center py-8">
                <div className="w-full max-w-sm">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google login failed')}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width="100%"
                  />
                </div>
                {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                <div className="mt-8 p-4 rounded-xl w-full" style={{ background: '#f5f5f5' }}>
                  <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                    <HiOutlineBookOpen size={14} />
                    Sign in with your Google account to access the portal
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Quote */}
            <div className="mt-6 md:hidden text-center p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="text-white/90 text-sm italic">"{quote.text}"</p>
              <p className="text-white/60 text-xs mt-1">— {quote.author}</p>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} American University of Yangon</p>
        </div>
      </motion.div>
    </div>
  );
}
