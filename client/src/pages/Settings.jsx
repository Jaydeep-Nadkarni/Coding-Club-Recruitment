import React from 'react';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { Check } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme, colorScheme, changeColorScheme, colorSchemes } = useTheme();

  return (
    <Layout>
      <div className="mb-6 flex items-center text-sm text-dark-500 dark:text-dark-400">
        <span>Workspace</span>
        <span className="mx-2">/</span>
        <span className="text-dark-900 dark:text-white font-medium">Settings</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-dark-200 dark:border-dark-700 bg-light-50 dark:bg-dark-800/50">
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Appearance Settings</h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">Customize the look and feel of your workspace</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Theme Mode */}
            <div>
              <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-4">Theme Mode</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`
                    flex-1 p-4 rounded-lg border-2 transition-all
                    ${theme === 'light' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                    }
                  `}
                >
                  <div className="h-24 bg-light-100 rounded mb-3 border border-dark-200"></div>
                  <div className="font-medium text-dark-900 dark:text-white">Light Mode</div>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`
                    flex-1 p-4 rounded-lg border-2 transition-all
                    ${theme === 'dark' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                    }
                  `}
                >
                  <div className="h-24 bg-dark-900 rounded mb-3 border border-dark-700"></div>
                  <div className="font-medium text-dark-900 dark:text-white">Dark Mode</div>
                </button>
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-4">Accent Color</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(colorSchemes).map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => changeColorScheme(scheme)}
                    className={`
                      p-4 rounded-lg border-2 transition-all flex items-center justify-between
                      ${colorScheme === scheme 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full mr-3" 
                        style={{ backgroundColor: colorSchemes[scheme][500] }}
                      ></div>
                      <span className="capitalize font-medium text-dark-900 dark:text-white">{scheme}</span>
                    </div>
                    {colorScheme === scheme && <Check size={16} className="text-primary-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
