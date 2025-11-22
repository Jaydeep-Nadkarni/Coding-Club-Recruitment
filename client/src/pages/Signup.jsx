import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return { level: 'weak', score: 0, message: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (password.length >= 14) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    
    let level = 'weak';
    let message = 'Weak';
    
    if (score >= 5) {
      level = 'strong';
      message = 'Strong';
    } else if (score >= 3) {
      level = 'medium';
      message = 'Medium';
    }
    
    return { level, score, message };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      navigate('/'); // Redirect to dashboard
    } catch (error) {
      setApiError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-900 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-xl shadow-2xl border border-dark-200 dark:border-dark-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-dark-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-dark-600 dark:text-dark-400">
            Join us to get started
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-editor-red" />
            <p className="text-sm text-editor-red">{apiError}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              showPasswordToggle={true}
            />
            
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.level === 'strong' ? 'w-full bg-editor-green' :
                        passwordStrength.level === 'medium' ? 'w-2/3 bg-yellow-500' :
                        'w-1/3 bg-editor-red'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.level === 'strong' ? 'text-editor-green' :
                    passwordStrength.level === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-editor-red'
                  }`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <div className="text-xs text-dark-500 dark:text-dark-400 space-y-1">
                  <p>Password should contain:</p>
                  <ul className="ml-2 space-y-0.5">
                    <li className={/[a-z]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      ✓ Lowercase letters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      ✓ Uppercase letters
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      ✓ Numbers
                    </li>
                    <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      ✓ Special characters
                    </li>
                    <li className={formData.password.length >= 10 ? 'text-editor-green' : 'text-dark-500'}>
                      ✓ At least 10 characters
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              showPasswordToggle={true}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
          >
            Create Account
          </Button>

          <div className="text-center text-sm">
            <span className="text-dark-600 dark:text-dark-400">
              Already have an account?{' '}
            </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
