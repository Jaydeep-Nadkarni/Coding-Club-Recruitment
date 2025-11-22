import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
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
      await login(formData.email, formData.password);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setApiError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-900 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-800 p-8 rounded-lg border border-dark-100 dark:border-dark-700 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-50 dark:bg-dark-700 rounded-lg">
              <Lock size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-dark-600 dark:text-dark-400">
            Sign in to your account
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
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="name@example.com"
              autoComplete="email"
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
              autoComplete="current-password"
              showPasswordToggle={true}
              icon={Lock}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-300 rounded bg-white dark:bg-dark-700 dark:border-dark-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-dark-700 dark:text-dark-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                Forgot?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
          >
            Sign in
          </Button>

          <div className="text-center text-sm">
            <span className="text-dark-600 dark:text-dark-400">
              Don't have an account?{' '}
            </span>
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
