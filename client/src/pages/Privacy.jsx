import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Privacy = () => {
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
        <h1 className="text-5xl font-bold mb-8">Privacy Policy</h1>
        <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Last updated: November 2025
        </p>

        <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none space-y-8`}>
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              TaskMaster ("we", "us", "our" or "Company") operates the https://www.taskmaster.com website and mobile application (hereinafter referred to as the "Service").

              Our Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use our website and application.

              Please read this Privacy Policy carefully. By accessing or using TaskMaster, you acknowledge that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              We collect information about you in a variety of ways. The information we may collect on the site includes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Personal Data:</strong> Name, email address, password, and other account information you provide during registration</li>
              <li><strong>Usage Data:</strong> Information about your interactions with our service, including tasks created, completed, and viewed</li>
              <li><strong>Device Information:</strong> Browser type, IP address, operating system, and similar technical information</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience</li>
              <li><strong>Communications:</strong> When you contact us, we store the information you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer service and support</li>
              <li>To gather analysis or valuable information so we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues and fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              We implement comprehensive security measures to protect your personal information. Your personal data is stored on secure servers with encryption enabled. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Links</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              Our Service may contain links to other sites that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your information or using those services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Access your personal data</li>
              <li>Correct or update your personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              We will retain your personal data only for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will also delete your personal data unless we are required to retain it by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Privacy Policy</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              If you have any questions about this Privacy Policy or our privacy practices, please <a href="/contact" className="text-indigo-600 hover:text-indigo-700">contact us</a>.
            </p>
          </section>

          <section className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-lg font-bold mb-2">GDPR Compliance</h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              If you are located in the European Union, you have additional rights under the General Data Protection Regulation (GDPR). Please see our GDPR notice for more information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
