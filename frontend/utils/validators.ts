interface ValidationResult {
  valid: boolean;
  message: string;
}

export const validateLoginId = (loginId: string): ValidationResult => {
  if (!loginId) return { valid: false, message: 'Login ID is required' };
  if (loginId.length < 6) return { valid: false, message: 'Login ID must be at least 6 characters' };
  if (loginId.length > 12) return { valid: false, message: 'Login ID must be at most 12 characters' };
  if (!/^[a-zA-Z0-9_]+$/.test(loginId)) return { valid: false, message: 'Login ID can only contain letters, numbers, and underscores' };
  return { valid: true, message: '' };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) return { valid: false, message: 'Email is required' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address' };
  return { valid: true, message: '' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Must contain at least one lowercase letter' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Must contain at least one uppercase letter' };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, message: 'Must contain at least one special character' };
  return { valid: true, message: '' };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match' };
  return { valid: true, message: '' };
};
