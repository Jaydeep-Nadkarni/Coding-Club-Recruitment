import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  error,
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPasswordInput = type === 'password' && showPasswordToggle;
  const inputType = isPasswordInput && showPassword ? 'text' : type;
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          name={name}
          id={name}
          className={`
            w-full px-3 py-2 
            bg-white dark:bg-dark-800 
            border border-dark-300 dark:border-dark-600 
            rounded-md shadow-sm 
            text-dark-900 dark:text-white 
            placeholder-dark-400 dark:placeholder-dark-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-dark-50 dark:disabled:bg-dark-900 disabled:cursor-not-allowed
            transition-colors duration-200
            ${error ? 'border-editor-red focus:ring-editor-red focus:border-editor-red' : ''}
            ${isPasswordInput ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-700 dark:text-dark-400 dark:hover:text-dark-200 transition-colors"
            tabIndex="-1"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-editor-red animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
