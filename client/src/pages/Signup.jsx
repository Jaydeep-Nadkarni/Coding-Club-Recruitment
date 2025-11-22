import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, User, Mail, Lock, CheckCircle2, Circle } from 'lucide-react';
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
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setApiError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-lg border border-dark-100 dark:border-dark-700 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-50 dark:bg-dark-700 rounded-lg">
              <User size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-dark-600 dark:text-dark-400">
            Join us to get started
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-editor-red flex-shrink-0" />
            <p className="text-sm text-editor-red">{apiError}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              icon={User}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="name@example.com"
              icon={Mail}
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
              icon={Lock}
            />
            
            {formData.password && (
              <div className="mt-3 p-3 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.level === 'strong' ? 'w-full bg-editor-green' :
                        passwordStrength.level === 'medium' ? 'w-2/3 bg-yellow-500' :
                        'w-1/3 bg-editor-red'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-semibold whitespace-nowrap ${
                    passwordStrength.level === 'strong' ? 'text-editor-green' :
                    passwordStrength.level === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-editor-red'
                  }`}>
                    {passwordStrength.message}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-xs">
                    {/[a-z]/.test(formData.password) ? (
                      <CheckCircle2 size={14} className="text-editor-green flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-dark-400 flex-shrink-0" />
                    )}
                    <span className={/[a-z]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      Lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    {/[A-Z]/.test(formData.password) ? (
                      <CheckCircle2 size={14} className="text-editor-green flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-dark-400 flex-shrink-0" />
                    )}
                    <span className={/[A-Z]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      Uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    {/[0-9]/.test(formData.password) ? (
                      <CheckCircle2 size={14} className="text-editor-green flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-dark-400 flex-shrink-0" />
                    )}
                    <span className={/[0-9]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      Number
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? (
                      <CheckCircle2 size={14} className="text-editor-green flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-dark-400 flex-shrink-0" />
                    )}
                    <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-editor-green' : 'text-dark-500'}>
                      Special character
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    {formData.password.length >= 10 ? (
                      <CheckCircle2 size={14} className="text-editor-green flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-dark-400 flex-shrink-0" />
                    )}
                    <span className={formData.password.length >= 10 ? 'text-editor-green' : 'text-dark-500'}>
                      At least 10 characters
                    </span>
                  </li>
                </ul>
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
              icon={Lock}
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
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
