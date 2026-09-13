import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { isAdminUser } from '../lib/admin';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onPageChange: (page: string) => void;
}


export const LoginPage: React.FC<LoginPageProps> = ({ onPageChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [message, setMessage] = useState('');


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) throw new Error('Sign-in is unavailable. Please try again later.');
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(), password,
      });
      if (signInError) throw new Error('Unable to sign in. Check your email and password.');
      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut();
        throw new Error('This account does not have administrator access.');
      }
      onPageChange('admin');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      setPassword('');
      setIsLoading(false);
    }

  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setMessage(''); setIsLoading(true);
    try {
      if (!email.trim()) throw new Error('Enter your email to reset your password.');
      if (!supabase) throw new Error('Password reset is unavailable. Please try again later.');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: 'https://www.speakerscircle.org/reset-password' });
      if (resetError) throw new Error('Unable to send the reset email. Check the address and try again.');
      setMessage('Check your email for a password reset link.');
    } catch (resetError) { setError(resetError instanceof Error ? resetError.message : 'Unable to send the reset email.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#FFF7C0]/30 via-white to-[#6EC4DB]/10 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FA7C92] to-[#6EC4DB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Sign in with your administrator account</p>
          </div>

          <form onSubmit={forgotMode ? handleForgotPassword : handleLogin} className="space-y-6">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input id="admin-email" type="email" autoComplete="username" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>
            {!forgotMode && <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA7C92] focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {message && <div role="status" className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                forgotMode ? 'Send reset email' : 'Sign in'
              )}
            </button>
            <button type="button" onClick={() => { setForgotMode(!forgotMode); setError(''); setMessage(''); }} className="w-full text-sm text-[#66AB8C] hover:underline">{forgotMode ? 'Back to sign in' : 'Forgot password?'}</button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => onPageChange('home')}
              className="text-gray-500 hover:text-[#FA7C92] text-sm transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
