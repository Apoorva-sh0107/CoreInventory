'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import {
  validateLoginId,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '@/utils/validators';

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    let newErrors: Record<string, string> = {};

    const loginIdValidation = validateLoginId(formData.loginId);
    if (!loginIdValidation.valid) {
      newErrors.loginId = loginIdValidation.message;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    const matchValidation = validatePasswordMatch(
      formData.password,
      formData.confirmPassword
    );
    if (!matchValidation.valid) {
      newErrors.confirmPassword = matchValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup(formData.loginId, formData.email, formData.password);
      if (result.success) {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (err) {
      setErrors({ submit: 'An error occurred during signup.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'loginId', label: 'Login Id', type: 'text', placeholder: '6–12 characters' },
    { name: 'email', label: 'Email Id', type: 'email', placeholder: 'you@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 characters' },
    { name: 'confirmPassword', label: 'Re-Enter Password', type: 'password', placeholder: 'Confirm password' },
  ];

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
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-center text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
            Create Account
          </h1>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--text-muted)' }}>
            Set up your credentials to get started.
          </p>
        </motion.div>

        <form onSubmit={handleSignUp}>
          <div>
            {fields.map((field, i) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              >
                <div className="form-row">
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className={errors[field.name] ? 'input-error' : ''}
                    disabled={isLoading}
                  />
                </div>
                {errors[field.name] && (
                  <motion.p
                    className="text-xs font-medium mt-1.5"
                    style={{ color: 'var(--error)', paddingLeft: 160 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors[field.name]}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>

          {errors.submit && (
            <motion.p
              className="text-center text-sm font-medium mt-5"
              style={{ color: 'var(--error)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.submit}
            </motion.p>
          )}

          {successMessage && (
            <motion.p
              className="text-center text-sm font-medium mt-5"
              style={{ color: 'var(--success)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {successMessage}
            </motion.p>
          )}

          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Creating account...' : 'SIGN UP'}
            </button>
          </motion.div>
        </form>

        <div className="text-center mt-10 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link href="/login" className="auth-link">Login here</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
