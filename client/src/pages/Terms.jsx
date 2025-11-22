import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Terms = () => {
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
        <h1 className="text-5xl font-bold mb-8">Terms of Service</h1>
        <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Last updated: November 2025
        </p>

        <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none space-y-8`}>
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              By accessing and using TaskMaster, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. License</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              TaskMaster grants you a limited license to access and use our platform for your personal or business use, in accordance with these terms. This license does not include the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>Modify or copy the materials</li>
              <li>Use materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on TaskMaster</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Remove or alter the intellectual property notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              The materials on TaskMaster are provided on an 'as is' basis. TaskMaster makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              In no event shall TaskMaster or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TaskMaster, even if TaskMaster or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              The materials appearing on TaskMaster could include technical, typographical, or photographic errors. TaskMaster does not warrant that any of the materials on its website are accurate, complete, or current. TaskMaster may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Links</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              TaskMaster has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by TaskMaster of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Modifications</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              TaskMaster may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              These terms and conditions are governed by and construed in accordance with the laws of the State of California, and you irrevocably submit to the exclusive jurisdiction of the courts that are located in that state or location.
            </p>
          </section>

          <section className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-lg font-bold mb-2">Questions?</h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              If you have any questions about these Terms of Service, please <a href="/contact" className="text-indigo-600 hover:text-indigo-700">contact us</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
