import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Camera, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user: authUser, checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authUser) {
      setFormData(prev => ({
        ...prev,
        name: authUser.name || '',
        email: authUser.email || '',
        profilePicture: authUser.profilePicture || '',
      }));
    }
  }, [authUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePicture: 'Image size should be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        profilePicture: formData.profilePicture,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put('/users/profile', updateData);
      await checkAuth(); // Refresh global auth state
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm text-dark-500 dark:text-dark-400">
        <span>Workspace</span>
        <span className="mx-2">/</span>
        <span className="text-dark-900 dark:text-white font-medium">Profile</span>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800/50">
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Profile Settings</h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">Manage your account information and preferences</p>
          </div>

          <div className="p-6">
            {message.text && (
              <div className={`mb-6 p-4 rounded-md flex items-center gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p>{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-100 dark:bg-dark-700 border-2 border-dark-200 dark:border-dark-600">
                    {formData.profilePicture ? (
                      <img 
                        src={formData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-400">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                    <Camera size={24} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-medium text-dark-900 dark:text-white">Profile Picture</h3>
                  <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
                    Click the image to upload a new photo.
                    <br />
                    JPG, GIF or PNG. Max size of 5MB.
                  </p>
                  {errors.profilePicture && (
                    <p className="text-sm text-editor-red mt-1">{errors.profilePicture}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-700 pb-2">
                    Personal Information
                  </h3>
                  
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    icon={User}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    icon={Mail}
                  />

                  <div className="pt-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                      Member Since
                    </label>
                    <div className="flex items-center px-3 py-2 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-600 rounded-md text-dark-500 dark:text-dark-400">
                      <Calendar size={16} className="mr-2" />
                      {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-dark-900 dark:text-white border-b border-dark-200 dark:border-dark-700 pb-2">
                    Change Password
                  </h3>
                  
                  <Input
                    label="New Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                    placeholder="Leave blank to keep current"
                    showPasswordToggle={true}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={errors.confirmPassword}
                    placeholder="Leave blank to keep current"
                    showPasswordToggle={true}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-dark-200 dark:border-dark-700 flex justify-end">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
