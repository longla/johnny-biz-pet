import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/router';
import { type Session } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

type Status = 'verifying' | 'ready' | 'submitting' | 'success' | 'error';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('verifying');
  const router = useRouter();
  const supabase = createClient();

  const handleSessionFromURL = useCallback(async () => {
    const hash = window.location.hash;
    if (!hash) {
      setError('Invalid or expired link. No token found.');
      setStatus('error');
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (type !== 'recovery') {
        setError('Invalid link type. This page is only for password recovery.');
        setStatus('error');
        return;
    }

    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        setError('Failed to verify your session. The link may be expired.');
        setStatus('error');
      } else {
        setStatus('ready');
      }
    } else {
      setError('Invalid or incomplete link. Please try again.');
      setStatus('error');
    }
  }, [supabase.auth]);

  useEffect(() => {
    handleSessionFromURL();
  }, [handleSessionFromURL]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError('');
    setStatus('submitting');

    const { error: updateUserError } = await supabase.auth.updateUser({ password });

    if (updateUserError) {
      setError(updateUserError.message);
      setStatus('ready'); // Go back to ready state to allow another attempt
    } else {
      setStatus('success');
      setTimeout(() => {
        router.push('/sitter'); // Redirect to sitter dashboard
      }, 2000);
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'verifying':
        return <p className="text-center text-gray-500">Verifying your link...</p>;
      case 'error':
        return (
          <div className="text-center text-red-600">
            <FaExclamationCircle className="mx-auto text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-2">Link Error</h2>
            <p>{error}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center text-green-600">
            <FaCheckCircle className="mx-auto text-4xl mb-4" />
            <h2 className="text-xl font-bold mb-2">Password Set Successfully!</h2>
            <p>Redirecting you to your dashboard...</p>
          </div>
        );
      case 'ready':
      case 'submitting':
        return (
          <form onSubmit={handleSetPassword} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Choose a New Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#1A9CB0] focus:border-[#1A9CB0] sm:text-sm"
                  placeholder="Enter at least 6 characters"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#F28C38] border border-transparent rounded-md shadow-sm hover:bg-[#e07a26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F28C38] disabled:bg-gray-400"
              >
                {status === 'submitting' ? 'Saving...' : 'Save Password and Log In'}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Ruh-Roh Retreat</h1>
                <p className="text-gray-500">Sitter Portal</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
                {renderStatus()}
            </div>
        </motion.div>
    </div>
  );
}