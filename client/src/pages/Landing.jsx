import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, TrendingUp, ArrowRight, Menu, X, Sparkles, Shield, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AnimatedDashboardPreview from '../components/AnimatedDashboardPreview';

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold">TaskMaster</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`hover:text-indigo-600 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Features</a>
              <a href="#benefits" className={`hover:text-indigo-600 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Benefits</a>
             
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`pb-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <a href="#features" className="block py-2 text-sm hover:text-indigo-600">Features</a>
              <a href="#benefits" className="block py-2 text-sm hover:text-indigo-600">Benefits</a>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Manage Your Tasks with <span className="text-indigo-600">Intelligence</span>
            </h1>
            <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Organize, track, and complete your tasks efficiently. Get AI-powered performance insights and become more productive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
              >
                Start Free <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`flex items-center justify-center gap-2 px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-lg font-semibold`}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className={`relative h-96 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <AnimatedDashboardPreview />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle size={40} />,
                title: "Task Management",
                description: "Create, organize, and track tasks with ease. Categorize by priority and status."
              },
              {
                icon: <Sparkles size={40} />,
                title: "AI Performance Reports",
                description: "Get intelligent insights about your productivity and personalized recommendations."
              },
              {
                icon: <TrendingUp size={40} />,
                title: "Progress Tracking",
                description: "Visualize your progress with real-time statistics and completion metrics."
              },
              {
                icon: <Zap size={40} />,
                title: "Real-time Updates",
                description: "See changes instantly as you and your team update tasks and notifications."
              },
              {
                icon: <Shield size={40} />,
                title: "Secure & Private",
                description: "Your data is encrypted and secured with industry-standard authentication."
              },
              {
                icon: <Clock size={40} />,
                title: "Time Tracking",
                description: "Monitor time spent on tasks to improve efficiency and planning."
              },
            ].map((feature, index) => (
              <div key={index} className={`p-8 rounded-xl transition-all hover:shadow-lg ${isDarkMode ? 'bg-gray-900 hover:bg-gray-700' : 'bg-white hover:shadow-xl'}`}>
                <div className="text-indigo-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose TaskMaster?</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              title: "Boost Productivity",
              description: "Stay organized and focused. Complete more tasks in less time with intelligent prioritization."
            },
            {
              title: "AI-Powered Insights",
              description: "Get personalized performance reports powered by advanced AI analysis."
            },
            {
              title: "Intuitive Interface",
              description: "Beautiful, easy-to-use design that works seamlessly on all your devices."
            },
            {
              title: "Dark Mode Support",
              description: "Comfortable to use anytime, anywhere with adaptive dark and light themes."
            },
          ].map((benefit, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex-shrink-0">
                <CheckCircle className="text-indigo-600" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Join thousands of users managing their tasks smarter with TaskMaster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            Create Free Account <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className={`flex items-center justify-center gap-2 px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-lg font-semibold`}
          >
            Sign In to Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">TaskMaster</h4>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Intelligent task management for everyone.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
                <li><a href="#benefits" className="hover:text-indigo-600">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => navigate('/about')} className="hover:text-indigo-600 cursor-pointer">About</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-indigo-600 cursor-pointer">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-indigo-600 cursor-pointer">Privacy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-indigo-600 cursor-pointer">Terms</button></li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pt-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; 2025 TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
