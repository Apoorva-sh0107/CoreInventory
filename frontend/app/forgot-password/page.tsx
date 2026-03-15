'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { checkLoginIdExists } = useAuth();

  const [step, setStep] = useState(1);
  const [loginId, setLoginId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginId.trim()) { setError('Please enter your login ID'); return; }
    if (!checkLoginIdExists(loginId.trim())) { setError('Login ID not found'); return; }

    setIsLoading(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setSuccessMessage(`OTP sent! (Demo: ${code})`);
      setStep(2);
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp !== generatedOtp) { setError('Invalid OTP code'); return; }
    setSuccessMessage('OTP verified successfully');
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword.trim() || !confirmPassword.trim()) { setError('Please fill in all fields'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }

    setIsLoading(true);
    setTimeout(() => {
      setSuccessMessage('Password reset successfully!');
      setTimeout(() => router.push('/login'), 1500);
      setIsLoading(false);
    }, 1000);
  };

  const stepNames = ['Login ID', 'Verify OTP', 'New Password'];

  return (
    <AuthLayout>
      {/* Logo placeholder */}
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

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
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-center text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            Reset Password
          </h1>
          <p className="text-center text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {step === 1 && 'Enter your Login ID to receive a code.'}
            {step === 2 && 'Enter the 6-digit verification code.'}
            {step === 3 && 'Choose a new secure password.'}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex justify-center items-center gap-1 mb-10">
          {stepNames.map((name, i) => (
            <div key={i} className="flex items-center gap-1">
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: step >= i + 1 ? 'var(--primary)' : '#F0EDF2',
                  color: step >= i + 1 ? '#fff' : 'var(--text-muted)',
                }}
                animate={{ scale: step === i + 1 ? 1.05 : 1 }}
              >
                {i + 1}
              </motion.div>
              {i < 2 && (
                <div className="w-6 h-px" style={{ background: step > i + 1 ? 'var(--primary)' : '#D1D1D6' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <motion.form onSubmit={handleSendOTP} key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div>
              <div className="form-row">
                <label htmlFor="loginId">Login Id</label>
                <input id="loginId" type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="Enter your login ID" disabled={isLoading} />
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Sending...' : 'SEND OTP'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.form onSubmit={handleVerifyOTP} key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div>
              <div className="form-row">
                <label htmlFor="otp">OTP Code</label>
                <input
                  id="otp" type="text" value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  disabled={isLoading}
                  style={{ textAlign: 'center', letterSpacing: '0.35em', fontWeight: 700, fontSize: '20px' }}
                />
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <button type="submit" className="btn-primary">VERIFY CODE</button>
            </div>
          </motion.form>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.form onSubmit={handleResetPassword} key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div>
              <div className="form-row">
                <label htmlFor="newPwd">New Password</label>
                <input id="newPwd" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" disabled={isLoading} />
              </div>
              <div className="form-row">
                <label htmlFor="confirmPwd">Confirm Password</label>
                <input id="confirmPwd" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" disabled={isLoading} />
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Resetting...' : 'RESET PASSWORD'}
              </button>
            </div>
          </motion.form>
        )}

        {/* Messages */}
        {error && (
          <motion.p className="text-center text-sm font-medium mt-5" style={{ color: 'var(--error)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>
        )}
        {successMessage && !error && (
          <motion.p className="text-center text-sm font-medium mt-5" style={{ color: 'var(--success)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{successMessage}</motion.p>
        )}

        <div className="text-center mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href="/login" className="auth-link">← Back to Login</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
