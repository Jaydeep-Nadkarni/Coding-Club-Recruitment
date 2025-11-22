import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  onClick,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 dark:focus:ring-offset-dark-900',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500 dark:focus:ring-offset-dark-900',
    outline: 'border-2 border-dark-200 dark:border-dark-700 text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-800 focus:ring-dark-500',
    ghost: 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white',
    danger: 'bg-editor-red hover:bg-red-600 text-white focus:ring-red-500',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
