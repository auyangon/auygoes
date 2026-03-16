import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiEyeOff, HiAcademicCap, HiLockClosed, HiMail, HiSparkles } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!email.includes('@')) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login(email, password);
    if (!ok) {
      toast.error('Invalid credentials. Try student@auy.edu.mm / password', { icon: '🔐' });
    } else {
      toast.success('Welcome back! 🎉');
    }
  };

  const fillDemo = () => {
    setEmail('student@auy.edu.mm');
    setPassword('password');
    setErrors({});
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(167,243,208,0.45)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(204,251,241,0.50)' }} />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(94,234,212,0.25)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 relative glow-teal"
            style={{
              background: 'rgba(255,255,255,0.90)',
              border: '1px solid rgba(20,184,166,0.18)',
              boxShadow: '0 8px 32px rgba(20,184,166,0.18)',
            }}
          >
            <HiAcademicCap className="text-4xl" style={{ color: '#14b8a6' }} />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 dot-pulse"
              style={{ border: '2px solid #f0faf7' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold gradient-text mb-1"
          >
            AUY Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm"
            style={{ color: '#9ca3af' }}
          >
            American University of Yangon
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-3xl p-7 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.84)',
            backdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(20,184,166,0.14)',
            boxShadow: '0 20px 60px rgba(20,184,166,0.12), 0 4px 16px rgba(20,184,166,0.07)',
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none"
            style={{ background: 'rgba(167,243,208,0.30)' }} />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full blur-[50px] pointer-events-none"
            style={{ background: 'rgba(204,251,241,0.30)' }} />

          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {/* Demo banner */}
            <motion.button
              type="button"
              onClick={fillDemo}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all"
              style={{
                background: 'rgba(20,184,166,0.08)',
                color: '#0d9488',
                border: '1px solid rgba(20,184,166,0.18)',
              }}
            >
              <HiSparkles className="text-sm flex-shrink-0" />
              <span className="flex-1 text-left">Click to fill demo credentials</span>
              <span className="opacity-60">student@auy.edu.mm</span>
            </motion.button>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4b5563' }}>
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                  style={{ color: '#5eead4' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  placeholder="your.id@auy.edu.mm"
                  className={`input-glass w-full pl-10 pr-4 py-3 rounded-2xl text-sm ${errors.email ? 'border-red-300' : ''}`}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs mt-1 ml-1" style={{ color: '#ef4444' }}>
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#4b5563' }}>
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                  style={{ color: '#5eead4' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  className={`input-glass w-full pl-10 pr-10 py-3 rounded-2xl text-sm ${errors.password ? 'border-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#5eead4' }}
                >
                  {showPassword ? <HiEyeOff className="text-base" /> : <HiEye className="text-base" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs mt-1 ml-1" style={{ color: '#ef4444' }}>
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-60 mt-2"
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                boxShadow: '0 8px 24px rgba(20,184,166,0.32)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                  />
                  Signing in…
                </span>
              ) : (
                'Sign In to Portal'
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[11px] mt-5" style={{ color: '#d1d5db' }}>
            Protected by AUY IT Services · {new Date().getFullYear()}
          </p>
        </motion.div>

        {/* Bottom tagline */}
        <p className="text-center text-xs mt-6" style={{ color: '#5eead4' }}>
          🎓 American University of Yangon — Student Portal v2.0
        </p>
      </motion.div>
    </div>
  );
}
