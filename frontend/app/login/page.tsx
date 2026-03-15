'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginId.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(loginId.trim(), password.trim());
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* ── YOUR LOGO ── Replace src with your own logo */}
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {/* Card */}
      <div
        className="backdrop-blur-xl rounded-[32px] px-12 py-16"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12), 0 0 1px rgba(15, 23, 42, 0.2)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-center text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            Welcome Back
          </h1>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
            Sign in to access your inventory dashboard.
          </p>
        </motion.div>

        <form onSubmit={handleLogin}>
          <div>
            <motion.div
              className="form-row"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <label htmlFor="loginId">Login Id</label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter your login ID"
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              className="form-row"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </motion.div>
          </div>

          {/* Error */}
          {error && (
            <motion.p
              className="text-center text-sm font-medium mt-5"
              style={{ color: 'var(--error)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          {/* Button */}
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <div className="text-center mt-10 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/forgot-password" className="auth-link">
            Forget Password?
          </Link>
          <span className="mx-3" style={{ color: 'var(--text-muted)' }}>|</span>
          <Link href="/signup" className="auth-link">
            Sign Up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
