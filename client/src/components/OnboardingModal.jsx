import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const OnboardingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100">
        <div className="relative p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-2">
            Welcome to AuthDash!
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-6">
            Your new UltraEdit-inspired productivity workspace is ready. 
            Here are a few quick tips to get you started:
          </p>

          <div className="space-y-4 text-left bg-light-50 dark:bg-dark-900/50 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <span className="bg-dark-200 dark:bg-dark-700 text-xs font-mono px-2 py-1 rounded mr-3 mt-0.5">Ctrl+K</span>
              <span className="text-sm text-dark-700 dark:text-dark-300">Quickly search files and commands</span>
            </div>
            <div className="flex items-start">
              <span className="bg-dark-200 dark:bg-dark-700 text-xs font-mono px-2 py-1 rounded mr-3 mt-0.5">Ctrl+B</span>
              <span className="text-sm text-dark-700 dark:text-dark-300">Toggle the sidebar visibility</span>
            </div>
            <div className="flex items-start">
              <span className="bg-dark-200 dark:bg-dark-700 text-xs font-mono px-2 py-1 rounded mr-3 mt-0.5">Theme</span>
              <span className="text-sm text-dark-700 dark:text-dark-300">Customize colors in Settings</span>
            </div>
          </div>

          <Button onClick={onClose} fullWidth>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
