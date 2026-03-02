import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const VALID_EMAILS = [
    'aung.khant.phyo@student.au.edu.mm',
    'hsu.eain.htet@student.au.edu.mm',
    'htoo.yadanar.oo@student.au.edu.mm',
    'chanmyae.au.edu.mm@gmail.com',
    'kaung.pyae.phyo.kyaw@student.au.edu.mm',
    'man.sian.hoih@student.au.edu.mm',
    'phone.pyae.han@student.au.edu.mm',
    'thin.zar.li.htay@student.au.edu.mm',
    'yoon.thiri.naing@student.au.edu.mm',
    'zau.myu.lat@student.au.edu.mm',
    'en.sian.piang@student.au.edu.mm',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!VALID_EMAILS.includes(email)) {
      setError('Email not found. Please check your email address.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSent(true);
      setMessage(`Password reset link sent to ${email}`);
      setLoading(false);
    }, 1500);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Check Your Email</h1>
            <p className="text-gray-500 text-sm mt-2">
              We've sent a password reset link to:
            </p>
            <p className="text-[#2E8B57] font-medium mt-1">{email}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 bg-[#2E8B57] text-white font-medium rounded-lg hover:bg-[#3CB371] transition-colors"
            >
              Return to Login
            </button>
            
            <button
              onClick={() => setSent(false)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-[#2E8B57] bg-opacity-10 rounded-full mb-4">
            <KeyRound size={32} className="text-[#2E8B57]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                placeholder="your.email@au.edu.mm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#2E8B57] text-white font-medium rounded-lg hover:bg-[#3CB371] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-[#2E8B57] transition-colors">
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>

        <p className="mt-4 text-xs text-center text-gray-400">
          Note: This is a demo. In production, actual emails would be sent.
        </p>
      </div>
    </div>
  );
};
