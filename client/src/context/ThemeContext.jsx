import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

const colorSchemes = {
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
    500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a'
  },
  purple: {
    50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc',
    500: '#a855f7', 600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8', 900: '#581c87'
  },
  green: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
    500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d'
  },
  orange: {
    50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c',
    500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12'
  }
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });
  const [colorScheme, setColorScheme] = useState(() => {
    const savedScheme = localStorage.getItem('colorScheme');
    return savedScheme || 'blue';
  });

  // Sync theme with user preference when user logs in
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    }
    // In a real app, we would also sync colorScheme from backend
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = colorSchemes[colorScheme];
    
    Object.keys(colors).forEach(key => {
      root.style.setProperty(`--color-primary-${key}`, colors[key]);
    });
    
    localStorage.setItem('colorScheme', colorScheme);
  }, [colorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    if (user) {
      try {
        await api.put('/users/theme', { theme: newTheme });
      } catch (error) {
        console.error('Failed to update theme preference:', error);
      }
    }
  };

  const changeColorScheme = (scheme) => {
    if (colorSchemes[scheme]) {
      setColorScheme(scheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorScheme, changeColorScheme, colorSchemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
