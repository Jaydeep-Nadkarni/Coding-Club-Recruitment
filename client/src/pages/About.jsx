import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Heart, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            <h1 className="text-xl font-bold">TaskMaster</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About TaskMaster</h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Transforming the way teams manage tasks and boost productivity
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="flex items-start gap-4 mb-8">
            <Target className="text-indigo-600 flex-shrink-0 mt-1" size={32} />
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                We're on a mission to empower individuals and teams to achieve their goals through intelligent task management. By combining intuitive design with AI-powered insights, we help you work smarter, not harder.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16">
          <div className="flex items-start gap-4 mb-8">
            <Heart className="text-indigo-600 flex-shrink-0 mt-1" size={32} />
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                A world where productivity tools are accessible, intuitive, and genuinely helpful. We believe in creating technology that respects your time and amplifies your potential.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Innovation",
                description: "We constantly innovate to bring you cutting-edge features and AI-powered insights that make your work easier."
              },
              {
                title: "Simplicity",
                description: "Complex tools overwhelm. We keep TaskMaster simple, intuitive, and focused on what matters most."
              },
              {
                title: "Trust",
                description: "Your data is sacred. We employ industry-leading security to keep your information safe and private."
              },
              {
                title: "Support",
                description: "We're here for you. Our dedicated team is always ready to help you succeed with TaskMaster."
              },
            ].map((value, index) => (
              <div key={index} className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="space-y-4">
            {[
              "AI-powered performance analytics to track your productivity",
              "Real-time collaboration features for seamless teamwork",
              "Enterprise-grade security for peace of mind",
              "Intuitive interface that requires no learning curve",
              "Dark mode support for comfortable usage anytime",
              "Affordable pricing with transparent billing",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <CheckCircle className="text-indigo-600 flex-shrink-0" size={24} />
                <span className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Us?</h2>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            Get Started Free
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;
